"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from finance.views import ExpenseViewSet, IncomeViewSet, expense_chart, dashboard_stats
from finance.views import (
    ExpenseViewSet,
    IncomeViewSet,
    expense_chart,
    dashboard_stats,
    monthly_expenses
)
from finance.views import (
    ExpenseViewSet,
    IncomeViewSet,
    expense_chart,
    income_chart,
    dashboard_stats
)

from finance.views import (
    ExpenseViewSet,
    IncomeViewSet,
    expense_chart,
    income_chart,
    dashboard_stats,
    monthly_expenses,
    monthly_incomes,
)

router = DefaultRouter()
router.register(r'expenses', ExpenseViewSet, basename="expenses")  # A végpont elérhető lesz: /api/expenses/
router.register(r'incomes', IncomeViewSet, basename='incomes')

urlpatterns = [
    path('admin/', admin.site.urls),

    path("api/dashboard/", dashboard_stats),
    
    path("api/expenses/chart/", expense_chart),   
    path("api/expenses/monthly/", monthly_expenses),
    

    path("api/incomes/chart/", income_chart),
    path("api/incomes/monthly/", monthly_incomes),

    path('api/', include(router.urls)),  # Az API végpontok bekapcsolása
]


#Ellenőrzés:
print("Regisztrált URL-ek:", router.urls)