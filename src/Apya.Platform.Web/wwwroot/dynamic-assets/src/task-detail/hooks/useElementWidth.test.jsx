import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useElementWidth, isGeneralStacked } from './useElementWidth';

/* QA-47 · 1280px ekranda sayfa kipindeki görev detayının Genel ızgarası ~531px; iki sütunda sol
   (açıklama + yorumlar) 129px'e iniyordu. Karar kabın ölçüsüne bağlı. */
describe('isGeneralStacked', () => {
    it('ölçümden önce viewport kırılımlarına bırakır', () => {
        expect(isGeneralStacked(0)).toBe(false);
    });

    it('dar kapta tek sütun, geniş kapta iki sütun', () => {
        expect(isGeneralStacked(531)).toBe(true);
        expect(isGeneralStacked(900)).toBe(false);
    });
});

function Probe() {
    const [ref, width] = useElementWidth();
    const [show, setShow] = React.useState(false);
    React.useEffect(() => { setShow(true); }, []);
    return (
        <div>
            <span data-testid="w">{width}</span>
            {show && <div ref={(node) => {
                if (node) node.getBoundingClientRect = () => ({ width: 531 });
                ref(node);
            }} />}
        </div>
    );
}

describe('useElementWidth', () => {
    it('sonradan bağlanan düğümü de ölçer', async () => {
        render(<Probe />);
        expect(await screen.findByText('531')).toBeInTheDocument();
    });
});
