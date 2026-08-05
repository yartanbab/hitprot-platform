/** Backend TaskStatus/TaskPriority enum değerlerinin (bkz TaskEnums.cs) Türkçe
 *  rozet karşılıkları — TaskDetailHeader ve TaskGeneralForm ortak kullanır. */
export const STATUS = {
    0: { text: 'İptal',      variant: 'neutral'  },
    1: { text: 'Yapılacak',  variant: 'neutral'  },
    2: { text: 'Sürüyor',    variant: 'warning'  },
    3: { text: 'Testte',     variant: 'brand'    },
    4: { text: 'Tamamlandı', variant: 'positive' },
};

export const PRIORITY = {
    1: { text: 'Düşük',  variant: 'positive' },
    2: { text: 'Orta',   variant: 'neutral'  },
    3: { text: 'Yüksek', variant: 'warning'  },
    4: { text: 'Kritik', variant: 'negative' },
};
