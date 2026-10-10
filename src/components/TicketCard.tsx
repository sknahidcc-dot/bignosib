import React, { useRef, useState } from 'react';
import { Download, Printer, Copy, Check, Sparkles, CheckCircle2, Trophy } from 'lucide-react';
import { Ticket } from '../types/lottery';

interface TicketCardProps {
  ticket: Ticket;
  drawTitle?: string;
  drawDate?: string;
}

export const TicketCard: React.FC<TicketCardProps> = ({
  ticket,
  drawTitle = 'Weekly Mega Jackpot Draw',
  drawDate,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Extract 6 digits from ticket number (e.g. BN-2026-547410 -> ['5','4','7','4','1','0'])
  const digits = (ticket.ticket_number.replace(/\D/g, '').slice(-6) || '547410').padStart(6, '0').split('');

  const formattedDate = drawDate
    ? new Date(drawDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).toUpperCase()
    : '18 OCT 2026';

  const drawNumber = ticket.draw_id.replace(/\D/g, '') || '48';
  const setNumber = ticket.id.slice(-2).toUpperCase() || '99';
  const barcodeNumber = `01${digits.join('')}99${drawNumber}2026`;

  const copyNumber = () => {
    navigator.clipboard.writeText(ticket.ticket_number);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  // High-resolution Canvas generator matching the exact physical paper lottery slip design
  const handleDownloadImage = () => {
    setDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1100;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Outer background transparent / subtle neutral
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, 1100, 400);

      // Realistic paper ticket container (1020 x 340)
      const tX = 40;
      const tY = 30;
      const tW = 1020;
      const tH = 340;
      const stubW = 90;
      const mainW = tW - stubW;

      // Drop shadow for the paper
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = 25;
      ctx.shadowOffsetX = 6;
      ctx.shadowOffsetY = 10;

      // Main paper body
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(tX, tY, mainW, tH);

      // Perforated stub background (Brown textured strip on right)
      ctx.fillStyle = '#B48858';
      ctx.fillRect(tX + mainW, tY, stubW, tH);

      // Reset shadow for inner elements
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Draw hatched lines on the brown stub
      ctx.strokeStyle = '#976C40';
      ctx.lineWidth = 1.5;
      for (let y = tY + 8; y < tY + tH; y += 8) {
        ctx.beginPath();
        ctx.moveTo(tX + mainW + 6, y);
        ctx.lineTo(tX + tW - 6, y);
        ctx.stroke();
      }

      // Vertical perforated tear-off line
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#D1D5DB';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(tX + mainW, tY);
      ctx.lineTo(tX + mainW, tY + tH);
      ctx.stroke();
      ctx.setLineDash([]); // reset

      // 1. Top-Left Ribbon Banner
      ctx.fillStyle = '#FCE7F3'; // Soft pastel pink banner
      ctx.fillRect(tX + 30, tY + 25, 420, 36);
      ctx.fillStyle = '#BE185D'; // Deep pink text
      ctx.font = 'bold 19px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('BIGNOSIB OFFICIAL LOTTERY', tX + 50, tY + 49);

      // Sub-label
      ctx.fillStyle = '#4B5563';
      ctx.font = 'italic 13px "DM Sans", sans-serif';
      ctx.fillText('Authorized Digital Edition', tX + 310, tY + 80);

      // 2. Central Artwork / Insignia (Golden Lottery Trophy / Lamp)
      // Decorative background rays
      ctx.fillStyle = '#FEF3C7';
      ctx.beginPath();
      ctx.arc(tX + 160, tY + 160, 48, 0, Math.PI * 2);
      ctx.fill();

      // Gold Trophy / Diya shape
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.arc(tX + 160, tY + 175, 34, 0, Math.PI, false);
      ctx.fill();

      // Golden Flame / Star
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.ellipse(tX + 160, tY + 130, 8, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FBBF24';
      ctx.beginPath();
      ctx.ellipse(tX + 160, tY + 134, 4, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // 3. Price stamp in bold red
      ctx.fillStyle = '#DC2626';
      ctx.font = 'bold 54px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('50', tX + 45, tY + 275);
      ctx.font = 'bold 18px "DM Sans", sans-serif';
      ctx.fillText('BDT', tX + 115, tY + 275);

      // Buyer name below
      ctx.fillStyle = '#6B7280';
      ctx.font = '12px "DM Sans", sans-serif';
      ctx.fillText(`Buyer: ${ticket.buyer_name || 'Verified Player'}`, tX + 45, tY + 305);

      // 4. Yellow 6-Digit Box (Top-Right)
      const digitBoxX = tX + 490;
      const digitBoxY = tY + 25;
      const digitBoxW = 400;
      const digitBoxH = 58;

      ctx.fillStyle = '#FDE047'; // Bright Yellow
      ctx.fillRect(digitBoxX, digitBoxY, digitBoxW, digitBoxH);
      ctx.strokeStyle = '#EAB308';
      ctx.lineWidth = 1;
      ctx.strokeRect(digitBoxX, digitBoxY, digitBoxW, digitBoxH);

      // 6 Digit numbers with individual column dividers
      const cellW = digitBoxW / 6;
      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 36px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';

      digits.forEach((d, idx) => {
        const cX = digitBoxX + idx * cellW + cellW / 2;
        ctx.fillText(d, cX, digitBoxY + 42);

        // Divider lines between cells
        if (idx > 0) {
          ctx.strokeStyle = '#CA8A04';
          ctx.beginPath();
          ctx.moveTo(digitBoxX + idx * cellW, digitBoxY);
          ctx.lineTo(digitBoxX + idx * cellW, digitBoxY + digitBoxH);
          ctx.stroke();
        }
      });
      ctx.textAlign = 'left'; // reset

      // 5. Date Line (e.g. 18 OCT 2026)
      ctx.fillStyle = '#2563EB';
      ctx.font = '600 17px "DM Sans", sans-serif';
      ctx.fillText(formattedDate, digitBoxX + 15, digitBoxY + 95);

      // 6. Period and Set Number Badges
      ctx.fillStyle = '#6B7280';
      ctx.font = '13px "DM Sans", sans-serif';
      ctx.fillText('Draw No.', digitBoxX + 15, digitBoxY + 130);

      ctx.fillStyle = '#FCE7F3';
      ctx.fillRect(digitBoxX + 75, digitBoxY + 114, 40, 24);
      ctx.fillStyle = '#9D174D';
      ctx.font = 'bold 14px "JetBrains Mono", monospace';
      ctx.fillText(drawNumber, digitBoxX + 83, digitBoxY + 131);

      ctx.fillStyle = '#6B7280';
      ctx.font = '13px "DM Sans", sans-serif';
      ctx.fillText('Set No.', digitBoxX + 130, digitBoxY + 130);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(setNumber, digitBoxX + 185, digitBoxY + 133);

      // 7. Authentic Barcode
      const barX = digitBoxX + 15;
      const barY = digitBoxY + 155;
      const barW = 370;
      ctx.fillStyle = '#111827';

      // Barcode pattern
      for (let x = 0; x < barW; x += 3.5) {
        const isThick = (x * 7) % 11 === 0 || (x * 13) % 17 === 0;
        const skip = (x * 3) % 19 === 0;
        if (!skip) {
          ctx.fillRect(barX + x, barY, isThick ? 2.5 : 1.2, 54);
        }
      }

      // Barcode serial number below
      ctx.fillStyle = '#374151';
      ctx.font = '13px "JetBrains Mono", monospace';
      ctx.fillText(barcodeNumber, barX + 35, barY + 75);

      // Winner stamp watermark if winner
      if (ticket.is_winner) {
        ctx.save();
        ctx.translate(tX + 280, tY + 220);
        ctx.rotate(-0.15);
        ctx.strokeStyle = '#059669';
        ctx.lineWidth = 4;
        ctx.strokeRect(-100, -28, 200, 56);
        ctx.fillStyle = '#059669';
        ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('★ WINNER ★', -70, 8);
        ctx.restore();
      }

      // Trigger download as clean picture
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `BigNosib-Lottery-${ticket.ticket_number}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error('Download error:', e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* REALISTIC PHYSICAL LOTTERY TICKET PAPER CONTAINER */}
      <div
        ref={cardRef}
        className="relative bg-white text-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-300 transition-all hover:shadow-amber-500/10 group select-none"
        style={{
          boxShadow: '0 12px 30px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div className="flex flex-col sm:flex-row items-stretch">
          {/* Main Paper Slip (Left & Center) */}
          <div className="flex-1 p-5 sm:p-6 bg-white relative overflow-hidden flex flex-col justify-between space-y-4">
            {/* Subtle paper watermark texture */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Top Row: Ribbon & Serial */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              {/* Pink Header Banner like in reference */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-pink-100/90 text-pink-700 font-bold text-xs sm:text-sm font-display tracking-tight border border-pink-200">
                <Sparkles className="w-3.5 h-3.5 text-pink-600" />
                <span>BIGNOSIB OFFICIAL LOTTERY</span>
              </div>

              <div className="text-[11px] font-mono text-slate-400">
                Ticket: <strong className="text-slate-800">{ticket.ticket_number}</strong>
              </div>
            </div>

            {/* Middle Row: Artwork, Price & 6-Digit Box */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Left Column: Artwork & Price */}
              <div className="md:col-span-5 flex items-center gap-4">
                {/* Central festive lamp / trophy artwork */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0 shadow-inner">
                  <div className="relative flex flex-col items-center justify-center">
                    <div className="w-3.5 h-5 bg-gradient-to-t from-amber-500 to-red-500 rounded-full animate-pulse shadow-sm" />
                    <div className="w-10 h-6 bg-amber-400 rounded-b-xl border border-amber-500 shadow-sm mt-0.5" />
                  </div>
                </div>

                {/* Price in Bold Red like the reference (80 Baht -> 50 BDT) */}
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-red-600 font-display tracking-tight">
                      50
                    </span>
                    <span className="text-xs font-black text-red-700 uppercase tracking-wider">
                      BDT
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Official Single Entry
                  </span>
                </div>
              </div>

              {/* Right Column: 6-Digit Yellow Box, Date & Barcode */}
              <div className="md:col-span-7 space-y-3">
                {/* Yellow 6-Digit Box with Individual Digit Columns */}
                <div className="bg-yellow-300 border border-yellow-400 rounded-lg p-1.5 shadow-sm">
                  <div className="grid grid-cols-6 divide-x divide-yellow-500/60 text-center">
                    {digits.map((digit, idx) => (
                      <div key={idx} className="px-1 py-0.5 flex flex-col items-center">
                        <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono leading-none">
                          {digit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Date & Period / Set No. */}
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <span className="text-blue-600 font-bold tracking-wide">
                    {formattedDate}
                  </span>

                  <div className="flex items-center gap-2 font-mono text-[11px] text-slate-600">
                    <span>Period: <strong className="px-1.5 py-0.5 rounded bg-pink-50 text-pink-700 font-bold border border-pink-200">{drawNumber}</strong></span>
                    <span>Set No: <strong className="text-slate-900 text-sm font-bold font-sans">{setNumber}</strong></span>
                  </div>
                </div>

                {/* Barcode lines */}
                <div className="space-y-1">
                  <div className="h-9 w-full flex items-center justify-between overflow-hidden bg-slate-50 p-1 rounded border border-slate-200">
                    {Array.from({ length: 58 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-slate-900 h-full"
                        style={{
                          width: i % 5 === 0 ? '3px' : i % 2 === 0 ? '1.5px' : '1px',
                          opacity: (i * 11) % 7 > 1 ? 0.95 : 0.3,
                        }}
                      />
                    ))}
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 text-center tracking-widest">
                    {barcodeNumber}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Details Row */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500">
              <div className="truncate max-w-[200px]">
                Holder: <strong className="text-slate-800">{ticket.buyer_name || 'Verified Player'}</strong>
              </div>

              {ticket.is_winner ? (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 text-xs flex items-center gap-1 animate-pulse">
                  <Trophy className="w-3.5 h-3.5 text-emerald-600" />
                  Winner: {ticket.prize_tier} Prize (৳{ticket.prize_amount.toLocaleString()})
                </span>
              ) : ticket.status === 'valid' ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 text-[11px] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Active In Draw #{drawNumber}
                </span>
              ) : (
                <span className="text-[11px] text-slate-400">
                  Expired / Archived
                </span>
              )}
            </div>
          </div>

          {/* Right Perforated Stub (Hatched Brown Paper Edge like reference) */}
          <div className="w-full sm:w-16 bg-[#B48858] relative border-t-2 sm:border-t-0 sm:border-l-2 border-dashed border-slate-300 flex sm:flex-col items-center justify-between p-2 overflow-hidden shadow-inner">
            {/* Horizontal hatched stripes pattern */}
            <div
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, #8C6239, #8C6239 1.5px, transparent 1.5px, transparent 7px)',
              }}
            />

            <span className="relative z-10 text-[9px] font-black uppercase text-amber-950/80 font-mono tracking-widest sm:[writing-mode:vertical-rl] sm:rotate-180 py-1">
              BIGNOSIB STUB
            </span>

            <span className="relative z-10 text-[10px] font-mono font-bold text-white bg-black/30 px-1.5 py-0.5 rounded">
              #{setNumber}
            </span>
          </div>
        </div>
      </div>

      {/* ACTION BAR: DOWNLOAD AS PICTURE & PRINT */}
      <div className="flex items-center justify-between pt-1 text-xs">
        <button
          onClick={copyNumber}
          className="text-slate-400 hover:text-white flex items-center gap-1.5 font-mono text-[11px] transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied Number' : ticket.ticket_number}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadImage}
            disabled={downloading}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all disabled:opacity-50"
            title="Download as Picture"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloading ? 'Saving Image...' : 'Download as Picture'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Print Ticket"
          >
            <Printer className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
