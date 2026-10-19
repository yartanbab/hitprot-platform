import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { TaskDetailFooterV3 } from './TaskDetailFooterV3';

// QA-15 · Sayfa kipinde kayıt çubuğu yapışkan: kap sabit yükseklikli olmadığı için
// çubuk içeriğin sonuna itilip ekran dışında kalıyordu.
describe('TaskDetailFooterV3', () => {
    it('sayfa kipinde (sticky) ekranın altına yapışır', () => {
        const { container } = render(<TaskDetailFooterV3 isDirty sticky onCancel={() => {}} onSave={() => {}} />);
        const footer = container.querySelector('footer');
        expect(footer.className).toContain('sticky');
        expect(footer.className).toContain('bottom-0');
    });

    it('modal kipinde (varsayılan) yapışkan değildir — pencere zaten sabit yükseklikli', () => {
        const { container } = render(<TaskDetailFooterV3 isDirty onCancel={() => {}} onSave={() => {}} />);
        expect(container.querySelector('footer').className).not.toContain('sticky');
    });
});
