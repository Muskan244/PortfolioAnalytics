from django.core.management.base import BaseCommand
from dashboard.models import (
    Holdings, Historical_Performance, Summary, Sector_Allocation, Market_Cap, Top_Performers
)
import pandas as pd
import os

class Command(BaseCommand):
    help = 'Import portfolio data for all models from an Excel (.xlsx) file with multiple sheets.'

    def add_arguments(self, parser):
        parser.add_argument('excel_path', type=str, help='Path to the Excel file to import')

    def handle(self, *args, **options):
        excel_path = options['excel_path']
        if not os.path.exists(excel_path):
            self.stderr.write(self.style.ERROR(f"File not found: {excel_path}"))
            return
        try:
            xl = pd.ExcelFile(excel_path)
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Error reading Excel file: {e}"))
            return

        # Import Holdings
        if 'Holdings' in xl.sheet_names:
            df = xl.parse('Holdings')
            created = 0
            for _, row in df.iterrows():
                holding = Holdings.objects.update_or_create(
                    Symbol=row.get('Symbol', ''),
                    defaults = {
                        'CompanyName':row.get('CompanyName', ''),
                        'Quantity':row.get('Quantity', 0),
                        'AvgPrice':row.get('AvgPrice', 0.0),
                        'CurrentPrice':row.get('CurrentPrice', 0.0),
                        'Sector':row.get('Sector', ''),
                        'MarketCap':row.get('MarketCap', ''),
                        'Exchange':row.get('Exchange', ''),
                        'Value':row.get('Value', 0.0),
                        'GainorLoss':row.get('GainorLoss', 0.0),
                        'GainorLossPercentage':row.get('GainorLossPercentage', 0.0),
                    }
                )
                created += 1
            self.stdout.write(self.style.SUCCESS(f"Imported {created} Holdings"))
        else:
            self.stdout.write(self.style.WARNING("No 'Holdings' sheet found."))

        # Import Historical_Performance
        if 'Historical_Performance' in xl.sheet_names:
            df = xl.parse('Historical_Performance')
            created = 0
            for _, row in df.iterrows():
                date_val = row.get('Date') or row.get('date')
                if not date_val or str(date_val).strip() == '':
                    continue

                if hasattr(date_val, 'date'):
                    date_val = date_val.date()
                elif isinstance(date_val, str):
                    date_val = date_val.strip()
                
                record = Historical_Performance.objects.update_or_create(
                    Date=date_val,
                    defaults = {
                        'PortfolioValue':row.get('PortfolioValue', 0.0),
                        'Nifty50':row.get('Nifty50', 0.0),
                        'Gold':row.get('Gold', 0.0),
                        'PortfolioReturn':row.get('PortfolioReturn', 0.0),
                        'Nifty50Return':row.get('Nifty50Return', 0.0),
                        'GoldReturn':row.get('GoldReturn', 0.0),
                    }
                )
                created += 1
            self.stdout.write(self.style.SUCCESS(f"Imported {created} Historical_Performance records"))
        else:
            self.stdout.write(self.style.WARNING("No 'Historical_Performance' sheet found."))

        # Import Summary
        if 'Summary' in xl.sheet_names:
            df = xl.parse('Summary')
            created = 0
            for _, row in df.iterrows():
                summary = Summary.objects.update_or_create(
                    Metric=row.get('Metric', ''),
                    defaults = {
                        'Value':row.get('Value', 0.0),
                    }
                )
                created += 1
            self.stdout.write(self.style.SUCCESS(f"Imported {created} Summary records"))
        else:
            self.stdout.write(self.style.WARNING("No 'Summary' sheet found."))

        # Import Sector_Allocation
        if 'Sector_Allocation' in xl.sheet_names:
            df = xl.parse('Sector_Allocation')
            created = 0
            for _, row in df.iterrows():
                sector = Sector_Allocation.objects.update_or_create(
                    Sector=row.get('Sector', ''),
                    defaults = {
                        'Value':row.get('Value', 0.0),
                        'Percentage':row.get('Percentage', 0.0),
                        'HoldingsCount':row.get('HoldingsCount', 0),
                    }
                )
                created += 1
            self.stdout.write(self.style.SUCCESS(f"Imported {created} Sector_Allocation records"))
        else:
            self.stdout.write(self.style.WARNING("No 'Sector_Allocation' sheet found."))

        # Import Market_Cap
        if 'Market_Cap' in xl.sheet_names:
            df = xl.parse('Market_Cap')
            created = 0
            for _, row in df.iterrows():
                cap = Market_Cap.objects.update_or_create(
                    MarketCap=row.get('MarketCap', ''),
                    defaults = {
                        'Value':row.get('Value', 0.0),
                        'Percentage':row.get('Percentage', 0.0),
                        'HoldingsCount':row.get('HoldingsCount', 0),
                    }
                )
                created += 1
            self.stdout.write(self.style.SUCCESS(f"Imported {created} Market_Cap records"))
        else:
            self.stdout.write(self.style.WARNING("No 'Market_Cap' sheet found."))

        # Import Top_Performers
        if 'Top_Performers' in xl.sheet_names:
            df = xl.parse('Top_Performers')
            created = 0
            for _, row in df.iterrows():
                top = Top_Performers.objects.update_or_create(
                    Metric=row.get('Metric', ''),
                    defaults = {
                        'Symbol':row.get('Symbol', ''),
                        'CompanyName':row.get('CompanyName', ''),
                        'Performance':row.get('Performance', 0.0),
                    }
                )
                created += 1
            self.stdout.write(self.style.SUCCESS(f"Imported {created} Top_Performers records"))
        else:
            self.stdout.write(self.style.WARNING("No 'Top_Performers' sheet found."))

        self.stdout.write(self.style.SUCCESS(f"Successfully imported all available sheets from {excel_path}"))
