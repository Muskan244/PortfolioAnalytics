from django.urls import path
from .views import HoldingsListAPIView, PortfolioAllocationAPIView, PerformanceComparisonAPIView, PortfolioSummaryAPIView

urlpatterns = [
    path('api/portfolio/holdings/', HoldingsListAPIView.as_view(), name='holdings-list'),
    path('api/portfolio/allocation/', PortfolioAllocationAPIView.as_view(), name='allocation-list'),
    path('api/portfolio/performance/', PerformanceComparisonAPIView.as_view(), name='performance-list'),
    path('api/portfolio/summary/', PortfolioSummaryAPIView.as_view(), name='summary'),
]
