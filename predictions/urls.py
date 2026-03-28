from django.urls import path
from .views import ProfitPredictionView

urlpatterns = [
    path('predict/', ProfitPredictionView.as_view(), name='predict'),
]