from rest_framework import serializers
from .models import Holdings, Sector_Allocation, Historical_Performance

class HoldingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Holdings
        fields = '__all__'

class SectorAllocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sector_Allocation
        fields = '__all__'

class HistoricalPerformanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Historical_Performance
        fields = '__all__'
