from rest_framework import serializers
from .models import Expense, Income 

class ExpenseSerializer(serializers.ModelSerializer):
    detail_url = serializers.HyperlinkedIdentityField(
        view_name='expenses-detail',
        lookup_field='pk'
    )

    class Meta:
        model = Expense
        fields = ['id', 'category', 'amount', 'date', 'detail_url']

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Az összegnek nagyobbnak kell lennie 0-nál."
            )
        return value


class IncomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Income
        fields = "__all__"

    def validate_amount(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Az összegnek nagyobbnak kell lennie 0-nál."
            )
        return value

    def __init__(self, *args, **kwargs):
        print("IncomeSerializer INIT")
        super().__init__(*args, **kwargs)

print("Income Serializers Loaded!")