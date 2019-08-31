// tslint:disable: no-floating-promises

import { TestBed } from '@angular/core/testing';

import { ZawgyiDetector } from '../src';

import { toFailOutput } from './shared.spec';

describe('ZawgyiDetector#detect#others', () => {
    let zawgyiDetector: ZawgyiDetector;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ZawgyiDetector
            ]
        });

        zawgyiDetector = TestBed.get<ZawgyiDetector>(ZawgyiDetector) as ZawgyiDetector;
    });

    // Outside block
    //
    it(String.raw`should detect input ' abc\n' as 'null'`, () => {
        const input = ' abc\n';

        const result = zawgyiDetector.detect(input);

        expect(result.detectedEnc).toBeFalsy(toFailOutput(input, result));
        expect(result.matches.length).toBe(1, toFailOutput(input, result));
        expect(result.matches[0].detectedEnc).toBeFalsy(toFailOutput(input, result));
        expect(result.matches[0].probability).toBe(0, toFailOutput(input, result));
        expect(result.matches[0].matchedString).toBe(input, toFailOutput(input, result));
    });

    // Mix detection
    //
    // 1
    it(String.raw`should detect input '\u103B\u1000\n[Unicode]\n\u1000\u1031\n' as 'mix'`, () => {
        const result = zawgyiDetector.detect('\u103B\u1000\n[Unicode]\n\u1000\u1031\n');
        expect(result.detectedEnc).toBe('mix');
        expect(result.matches.length).toBe(2);

        expect(result.matches[0].detectedEnc).toBe('zg');
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].matchedString).toBe('\u103B\u1000\n');

        expect(result.matches[1].detectedEnc).toBe('uni');
        expect(result.matches[1].start).toBe(3);
        expect(result.matches[1].matchedString).toBe('[Unicode]\n\u1000\u1031\n');
    });

    // 2
    it(String.raw`should detect input '\u103B\u1000\nယူနီကုဒ်။ \u1000\u1031\n' as 'mix'`, () => {
        const result = zawgyiDetector.detect('\u103B\u1000\nယူနီကုဒ်။ \u1000\u1031\n');
        expect(result.detectedEnc).toBe('mix');
        expect(result.matches.length).toBe(2);

        expect(result.matches[0].detectedEnc).toBe('zg');
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].matchedString).toBe('\u103B\u1000\n');

        expect(result.matches[1].detectedEnc).toBe('uni');
        expect(result.matches[1].start).toBe(3);
        expect(result.matches[1].matchedString).toBe('ယူနီကုဒ်။ \u1000\u1031\n');
    });

    // 3
    it(String.raw`should detect input '\u1000\u1031\nေဇာ္ဂ်ီ\u103B\u1000' as 'mix'`, () => {
        const result = zawgyiDetector.detect('\u1000\u1031\nေဇာ္ဂ်ီ\u103B\u1000');
        expect(result.detectedEnc).toBe('mix');
        expect(result.matches.length).toBe(2);

        expect(result.matches[0].detectedEnc).toBe('uni');
        expect(result.matches[0].start).toBe(0);
        expect(result.matches[0].matchedString).toBe('\u1000\u1031\n');

        expect(result.matches[1].detectedEnc).toBe('zg');
        expect(result.matches[1].start).toBe(3);
        expect(result.matches[1].matchedString).toBe('ေဇာ္ဂ်ီ\u103B\u1000');
    });
});