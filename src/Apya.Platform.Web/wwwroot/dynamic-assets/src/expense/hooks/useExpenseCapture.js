import { useMutation } from '@tanstack/react-query';
import { expenseFixtures } from './fixtures';

/* Backend swap point: api.post('/api/expenses/ocr', formData) */
export function useOcrParse() {
    return useMutation({
        mutationFn: (file) => expenseFixtures.ocr(file),
    });
}

/* Backend swap point: api.post('/api/expenses', payload) */
export function useSubmitExpense() {
    return useMutation({
        mutationFn: (payload) => expenseFixtures.submit(payload),
        retry: false, /* Finansal işlem — duplicate önlenir */
    });
}
