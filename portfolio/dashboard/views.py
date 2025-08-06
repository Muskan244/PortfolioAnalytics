import time
from rest_framework import generics, views
from rest_framework.response import Response
from datetime import timedelta
from .models import Holdings, Sector_Allocation, Historical_Performance, Market_Cap, Top_Performers
from .serializers import HoldingsSerializer, HistoricalPerformanceSerializer

class HoldingsListAPIView(generics.ListAPIView):
    queryset = Holdings.objects.all()
    serializer_class = HoldingsSerializer

class PortfolioAllocationAPIView(views.APIView):
    """
    API endpoint that returns combined sector and market cap allocation data.
    Performs validation to ensure only valid entries are included in the response.
    Returns 404 if no valid allocation data is found.
    """
    def get(self, request, *args, **kwargs):
        try:
            by_sector = {}
            for sector in Sector_Allocation.objects.all():
                # Validate sector fields: skip if any required field is missing
                if not sector.Sector or sector.Value is None or sector.Percentage is None:
                    continue
                try:
                    value = float(sector.Value)
                except Exception:
                    value = sector.Value
                by_sector[sector.Sector] = {
                    "value": value,
                    "percentage": sector.Percentage
                }
            by_market_cap = {}
            for cap in Market_Cap.objects.all():
                # Validate market cap fields: skip if any required field is missing
                if not cap.MarketCap or cap.Value is None or cap.Percentage is None:
                    continue
                try:
                    value = float(cap.Value)
                except Exception:
                    value = cap.Value
                by_market_cap[cap.MarketCap] = {
                    "value": value,
                    "percentage": cap.Percentage
                }
            if not by_sector and not by_market_cap:
                return Response({"detail": "No allocation data found."}, status=404)
            return Response({
                "bySector": by_sector,
                "byMarketCap": by_market_cap
            })
        except Exception as e:
            # Catch-all for unexpected server errors
            return Response({"detail": f"Server error: {str(e)}"}, status=500)

class PerformanceComparisonAPIView(views.APIView):
    """
    API endpoint that returns historical performance timeline and rolling returns for portfolio, Nifty50, and gold.
    - Validates each historical record for required fields.
    - Calculates rolling returns for 1 month, 3 months, and 1 year using helper functions.
    - Returns 404 if no valid data is found.
    """
    def get(self, request, *args, **kwargs):
        try:
            performances = list(Historical_Performance.objects.all().order_by('Date'))
            if not performances:
                return Response({"detail": "No historical performance data found."}, status=404)
            timeline = []
            portfolio_records = []
            nifty50_records = []
            gold_records = []
            for perf in performances:
                # Validate historical record fields: skip if any required field is missing
                if perf.Date is None or perf.PortfolioValue is None or perf.Nifty50 is None or perf.Gold is None:
                    continue
                timeline.append({
                    "date": perf.Date,
                    "portfolio": perf.PortfolioValue,
                    "nifty50": perf.Nifty50,
                    "gold": perf.Gold
                })
                portfolio_records.append((perf.Date, perf.PortfolioValue))
                nifty50_records.append((perf.Date, perf.Nifty50))
                gold_records.append((perf.Date, perf.Gold))

            if not timeline or not portfolio_records:
                return Response({"detail": "No valid historical performance records found."}, status=404)

            now = portfolio_records[-1][0]

            def get_return(latest, past):
                """
                Calculates percentage return given latest and past values.
                Returns None for invalid or zero past value.
                """
                if past is None or past == 0:
                    return None
                return round(((latest - past) / past) * 100, 2)

            def find_closest(records, target_date):
                """
                Finds the value in records whose date is closest to (but not after) target_date.
                If no value is found, returns the earliest available value.
                """
                closest = None
                for dt, val in reversed(records):
                    if dt <= target_date:
                        closest = val
                        break
                if closest is None and records:
                    closest = records[0][1]
                return closest

            def get_returns(records, now):
                """
                For a list of (date, value) records, computes rolling returns for 1m, 3m, 1y.
                """
                returns = {}
                periods = {
                    "1month": timedelta(days=30),
                    "3months": timedelta(days=90),
                    "1year": timedelta(days=365)
                }
                latest_value = records[-1][1]
                for label, delta in periods.items():
                    past_date = now - delta
                    past_value = find_closest(records, past_date)
                    if past_value is not None and isinstance(past_value, (int, float)) and past_value != 0:
                        returns[label] = get_return(latest_value, past_value)
                    else:
                        returns[label] = None
                return returns

            returns = {
                "portfolio": get_returns(portfolio_records, now),
                "nifty50": get_returns(nifty50_records, now),
                "gold": get_returns(gold_records, now),
            }

            return Response({
                "timeline": timeline,
                "returns": returns
            })
        except Exception as e:
            # Catch-all for unexpected server errors
            return Response({"detail": f"Server error: {str(e)}"}, status=500)

class PortfolioSummaryAPIView(views.APIView):
    """
    API endpoint that returns portfolio summary metrics and insights.
    - Validates holdings for required fields and numeric values.
    - Calculates total value, total invested, gain/loss, and gain/loss percent.
    - Identifies top and worst performers by gain percent.
    - Computes a simple diversification score based on unique sectors.
    - Returns 404 or 400 for invalid or empty data.
    """
    def get(self, request, *args, **kwargs):
        try:
            holdings = list(Holdings.objects.all())
            # Validate holdings for required fields and filter out invalid
            valid_holdings = []
            for h in holdings:
                # Ensure all required fields are present and numeric
                if h.Value is None or h.Quantity is None or h.AvgPrice is None or h.Symbol is None or h.CompanyName is None or h.GainorLossPercentage is None or h.Sector is None:
                    continue
                if not isinstance(h.Value, (int, float)) or not isinstance(h.Quantity, (int, float)) or not isinstance(h.AvgPrice, (int, float)):
                    continue
                valid_holdings.append(h)
            if not valid_holdings:
                return Response({"detail": "No valid holdings data found."}, status=404)
            # Calculate total portfolio value (current value of all holdings)
            total_value = sum(h.Value for h in valid_holdings)
            # Calculate total invested amount (sum of quantity * avg price for all holdings)
            total_invested = sum(h.Quantity * h.AvgPrice for h in valid_holdings)
            if total_invested <= 0:
                return Response({"detail": "Total invested amount is zero or negative."}, status=400)
            # Calculate absolute gain/loss and percentage gain/loss
            total_gain_loss = total_value - total_invested
            total_gain_loss_percent = round((total_gain_loss / total_invested) * 100, 2)
            # Identify top and worst performer by gain percent
            top = max(valid_holdings, key=lambda h: h.GainorLossPercentage, default=None)
            worst = min(valid_holdings, key=lambda h: h.GainorLossPercentage, default=None)
            # Compute diversification score as a simple function of unique sectors
            summary = {
                "totalValue": total_value,
                "totalInvested": total_invested,
                "totalGainLoss": total_gain_loss,
                "totalGainLossPercent": total_gain_loss_percent,
                "topPerformer": {
                    "symbol": top.Symbol if top else None,
                    "name": top.CompanyName if top else None,
                    "gainPercent": round(top.GainorLossPercentage * 100, 2) if top else None
                },
                "worstPerformer": {
                    "symbol": worst.Symbol if worst else None,
                    "name": worst.CompanyName if worst else None,
                    "gainPercent": round(worst.GainorLossPercentage * 100, 2) if worst else None
                },
                "diversificationScore": round(len(set(h.Sector for h in valid_holdings)) * 1.5, 2) if valid_holdings else 0.0,
                "riskLevel": "Moderate"
            }
            return Response(summary)
        except Exception as e:
            # Catch-all for unexpected server errors
            return Response({"detail": f"Server error: {str(e)}"}, status=500)
