import React from 'react';
import { isGranted } from '../hooks/useTaskDetail';

export function FinanceTab({ task }) {
    const hasAuth = typeof window !== 'undefined' && Boolean(window?.abp?.auth);
    const canViewExpenses = hasAuth ? isGranted('Platform.Expenses.Default') : true;
    const canViewIncomes = hasAuth ? isGranted('Platform.Incomes.Default') : true;

    if (!canViewExpenses && !canViewIncomes) {
        return (
            <div className="py-8 text-center text-sm text-text-tertiary">
                Finansal verileri görüntüleme yetkiniz bulunmuyor.
            </div>
        );
    }

    const expenses = task?.expenses || [];
    const incomes = task?.incomes || [];

    const totalExpense = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const totalIncome = incomes.reduce((acc, curr) => acc + (curr.amount || 0), 0);
    const netBalance = totalIncome - totalExpense;

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
                <div className="rounded-lg border border-default p-3 bg-surface-elevated">
                    <p className="text-xs text-text-tertiary">Toplam Gelir</p>
                    <p className="text-base font-semibold text-text-positive">{totalIncome.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</p>
                </div>
                <div className="rounded-lg border border-default p-3 bg-surface-elevated">
                    <p className="text-xs text-text-tertiary">Toplam Gider</p>
                    <p className="text-base font-semibold text-text-negative">{totalExpense.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</p>
                </div>
                <div className="rounded-lg border border-default p-3 bg-surface-elevated">
                    <p className="text-xs text-text-tertiary">Net Bakiye</p>
                    <p className={`text-base font-semibold ${netBalance >= 0 ? 'text-text-positive' : 'text-text-negative'}`}>
                        {netBalance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                    </p>
                </div>
            </div>

            <div className="rounded-lg border border-subtle p-3 bg-surface-base text-xs text-text-secondary">
                <p>Göreve bağlı detaylı harcama veya fatura ekleme işlemleri Finans Modülü üzerinden senkronize yönetilmektedir.</p>
            </div>
        </div>
    );
}
