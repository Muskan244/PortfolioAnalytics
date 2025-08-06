from django.db import models

# Create your models here.
class Holdings(models.Model):
    Symbol = models.CharField(max_length=20)
    CompanyName = models.CharField(max_length=100)
    Quantity = models.IntegerField()
    AvgPrice = models.FloatField()
    CurrentPrice = models.FloatField()
    Sector = models.CharField(max_length=50)
    MarketCap = models.CharField(max_length=50)
    Exchange = models.CharField(max_length=50)
    Value = models.FloatField()
    GainorLoss = models.FloatField()
    GainorLossPercentage = models.FloatField()
    
    def __str__(self):
        return f"{self.Symbol} - {self.CompanyName}"

class Historical_Performance(models.Model):
    Date = models.DateField()
    PortfolioValue = models.FloatField()
    Nifty50 = models.FloatField()
    Gold = models.FloatField()
    PortfolioReturn = models.FloatField()
    Nifty50Return = models.FloatField()
    GoldReturn = models.FloatField()
    
    def __str__(self):
        return f"{self.Date} - {self.PortfolioValue}"
        
class Summary(models.Model):
    Metric = models.CharField(max_length=50)
    Value = models.CharField(max_length=50)
    
    def __str__(self):
        return f"{self.Metric} - {self.Value}"

class Sector_Allocation(models.Model):
    Sector = models.CharField(max_length=50)
    Value = models.FloatField()
    Percentage = models.FloatField()
    HoldingsCount = models.IntegerField()
    
    def __str__(self):
        return f"{self.Sector} - {self.Value}"

class Market_Cap(models.Model):
    MarketCap = models.CharField(max_length=50)
    Value = models.CharField(max_length=50)
    Percentage = models.FloatField()
    HoldingsCount = models.IntegerField()
    
    def __str__(self):
        return f"{self.MarketCap} - {self.Value}"

class Top_Performers(models.Model):
    Metric = models.CharField(max_length=50)
    Symbol = models.CharField(max_length=20)
    CompanyName = models.CharField(max_length=100)
    Performance = models.CharField(max_length=50)
    
    def __str__(self):
        return f"{self.Metric} - {self.CompanyName}"