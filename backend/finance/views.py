from django.shortcuts import render
from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from django.db.models import Sum
from rest_framework.decorators import api_view
from .models import Expense, Income
from .serializers import ExpenseSerializer, IncomeSerializer
from django.db.models.functions import TruncMonth

print("IncomeSerializer =", IncomeSerializer)


class ExpenseViewSet(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class = ExpenseSerializer

    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["date", "id"]
    ordering = ["-date", "-id"]

    def get_queryset(self):
        queryset = Expense.objects.all()

        start_date = self.request.query_params.get("start_date")
        end_date = self.request.query_params.get("end_date")

        if start_date:
            queryset = queryset.filter(date__gte=start_date)

        if end_date:
            queryset = queryset.filter(date__lte=end_date)

        return queryset

    def create(self, request, *args, **kwargs):
        """Megakadályozza, hogy a böngésző frissítése miatt újra beküldje az utolsó adatot"""
        if request.session.get("last_expense") == request.data:
            return Response(
                {"error": "This request was already processed."},
                status=status.HTTP_400_BAD_REQUEST
            )

        response = super().create(request, *args, **kwargs)

        request.session["last_expense"] = request.data

        return response

        # Az adatot elmentjük a session-be, hogy a böngésző frissítés ne küldje be újra
        request.session["last_expense"] = request.data

        return response

class IncomeViewSet(viewsets.ModelViewSet):
    queryset = Income.objects.all()
    serializer_class = IncomeSerializer

    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["created_at", "id"]
    ordering = ["-created_at", "-id"]

    def get_queryset(self):
        queryset = Income.objects.all()

        start_date = self.request.query_params.get("start_date")
        end_date = self.request.query_params.get("end_date")

        if start_date:
            queryset = queryset.filter(date__gte=start_date)

        if end_date:
            queryset = queryset.filter(date__lte=end_date)

        return queryset

@api_view(["GET"])
def expense_chart(request):
    data = (
        Expense.objects
        .values("category")
        .annotate(total=Sum("amount"))
        .order_by("category")
    )

    return Response(data)

@api_view(["GET"])
def dashboard_stats(request):
    total_expenses = Expense.objects.aggregate(
        total=Sum("amount")
    )["total"] or 0

    total_income = Income.objects.aggregate(
        total=Sum("amount")
    )["total"] or 0

    return Response({
        "total_income": total_income,
        "total_expenses": total_expenses,
        "balance": total_income - total_expenses
    })

@api_view(["GET"])
def monthly_expenses(request):
    data = (
        Expense.objects
        .annotate(month=TruncMonth("date"))
        .values("month")
        .annotate(total=Sum("amount"))
        .order_by("month")
    )

    return Response(data)


@api_view(["GET"])
def income_chart(request):
    data = (
        Income.objects
        .values("category")
        .annotate(total=Sum("amount"))
        .order_by("category")
    )

    return Response(data)


@api_view(["GET"])
def monthly_incomes(request):
    data = (
        Income.objects
        .annotate(month=TruncMonth("date"))
        .values("month")
        .annotate(total=Sum("amount"))
        .order_by("month")
    )

    return Response(data)