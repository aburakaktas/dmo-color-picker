import { useState, useEffect, useRef, createContext, useContext, useLayoutEffect } from "react";
import chroma from "chroma-js";

function getContrastText(bg: string) {
  return chroma.contrast(bg, "#fff") >= 4.5 ? "#fff" : "#222";
}

function getAccessiblePrimary(color: string) {
  let c = chroma(color);
  let tries = 0;
  // Try darkening up to 10 times
  while (chroma.contrast(c, "#fff") < 4.5 && tries < 100) {
    c = c.darken(0.1);
    tries++;
  }
  return c.hex();
}

// Helper to get accessible CTA color and text color
function getAccessibleCtaAndText(cta: string) {
  let c = chroma(cta);
  let tries = 0;
  while (tries < 100) {
    const hover = c.darken(0.7);
    const contrastWhite = Math.min(chroma.contrast(c, '#fff'), chroma.contrast(hover, '#fff'));
    if (contrastWhite >= 4.5) return { color: c.hex(), text: '#fff' };
    c = c.darken(0.1);
    tries++;
  }
  // fallback: return the closest color, even if not fully accessible
  return { color: c.hex(), text: '#fff' };
}

// Figma-accurate List Item
function ListItem({ primary, cta, ctaText, image }: { primary: string; cta: string; ctaText: string; image: string }) {
  const [ctaHovered, setCtaHovered] = useState(false);
  const ctaHover = chroma(cta).darken(0.7).hex();
  const ctaBg = ctaHovered ? ctaHover : cta;

  return (
    <div className="bg-[#ffffff] relative rounded-[10px] w-[540px] overflow-hidden flex flex-row items-start justify-start">
      {/* Left section: Gallery - Figma accurate */}
      <div className="relative w-[159.078px] h-full flex-shrink-0">
        {/* Main image with border radius and overlay */}
        <div className="[background-size:cover,_auto] basis-0 grow h-full min-h-px min-w-px overflow-clip relative rounded-[10px] shrink-0" style={{ backgroundImage: `url(${image})` }}>
          {/* Gradient overlay */}
          <div className="absolute h-[139px] left-[123.759px] top-[0.3px] w-[35px]">
            <div className="absolute inset-0" style={{ background: 'linear-gradient(270deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.00) 100%)' }} />
          </div>
          {/* Star-Gastgeber tag */}
          <div className="absolute left-0 top-0 rounded-[5447.34px]">
            <div className="flex flex-row items-center justify-start pb-0 pl-[4.358px] pr-0 pt-[4.358px]">
              <div className="backdrop-blur-[3.26873px] bg-gradient-to-r from-[#2b6584] via-[#3885a0] to-[#54a3a9] rounded-[5447.34px]">
                <div className="flex flex-row items-center px-[6.537px] py-[3.269px] gap-[2.179px]">
                  <svg width="10.896" height="10.896" fill="none" viewBox="0 0 11 11"><g clipPath="url(#clip0_4_8311)"><path clipRule="evenodd" d="M6.67048 1.20793C6.10954 0.556419 5.13239 0.654141 4.5171 1.18389C3.90181 1.71365 3.65999 2.66543 4.22093 3.31694C4.78187 3.96846 5.75902 3.87074 6.37431 3.34098C6.9896 2.81123 7.23142 1.85945 6.67048 1.20793ZM5.10953 1.87198C5.46707 1.56414 5.84482 1.64056 5.9824 1.80036C6.11998 1.96015 6.13943 2.34506 5.78189 2.6529C5.42434 2.96073 5.0466 2.88431 4.90901 2.72452C4.77143 2.56472 4.75199 2.17981 5.10953 1.87198Z" fill="white" fillRule="evenodd"/><path clipRule="evenodd" d="M9.56943 5.54746C9.91894 5.23522 10.092 4.76004 9.92104 4.33968C9.83345 4.12435 9.66083 3.95124 9.42622 3.86794C9.19795 3.7869 8.94888 3.80315 8.70932 3.883C8.56961 3.92957 8.42609 3.98632 8.28746 4.04116C8.24317 4.05867 8.19931 4.07601 8.1563 4.09274C7.97144 4.16463 7.77437 4.23669 7.53963 4.3019C7.07342 4.43141 6.43384 4.54073 5.44795 4.54073C4.46205 4.54073 3.82247 4.43141 3.35626 4.3019C3.12153 4.23669 2.92445 4.16464 2.73959 4.09275C2.69655 4.07601 2.65274 4.05868 2.60842 4.04115C2.46979 3.98633 2.32628 3.92957 2.18658 3.883C1.93116 3.79787 1.6699 3.79519 1.43706 3.89834C1.20574 4.00083 1.04957 4.18731 0.96853 4.39116C0.81207 4.78474 0.915979 5.29382 1.32218 5.58894L1.32533 5.59123L2.93517 6.71919L2.24576 8.84097C1.97396 9.6775 2.93141 10.3731 3.643 9.85612L5.44795 8.54475L7.25289 9.85612C7.96449 10.3731 8.92194 9.67749 8.65013 8.84096L7.9607 6.71912L9.55235 5.56272L9.56943 5.54746ZM8.99643 4.74439C9.02659 4.73434 9.05083 4.72874 9.06974 4.72574C9.05799 4.75894 9.03184 4.8061 8.97877 4.85713L7.42701 5.98455C7.10877 6.21576 6.97561 6.6256 7.09716 6.99971L7.78659 9.12155L5.98165 7.81018C5.66341 7.57896 5.23249 7.57896 4.91425 7.81018L3.1093 9.12155L3.79873 6.99971C3.92029 6.6256 3.78712 6.21576 3.46889 5.98455L3.46574 5.98226L1.85382 4.85286C1.83004 4.83491 1.81719 4.81341 1.81099 4.79046C1.80401 4.76456 1.80688 4.74137 1.81171 4.72808L1.8154 4.72796C1.82862 4.72779 1.85601 4.72991 1.89946 4.74439C2.01351 4.78241 2.12402 4.8261 2.25536 4.87802C2.30383 4.89718 2.35513 4.91746 2.41049 4.93899C2.60868 5.01606 2.83722 5.10008 3.11323 5.17675C3.6685 5.331 4.39089 5.44871 5.44795 5.44871C6.50501 5.44871 7.2274 5.331 7.78267 5.17675C8.05867 5.10007 8.28721 5.01606 8.48541 4.93898C8.54076 4.91745 8.59205 4.89718 8.64051 4.87802C8.77185 4.8261 8.88238 4.7824 8.99643 4.74439Z" fill="white" fillRule="evenodd"/></g><defs><clipPath id="clip0_4_8311"><rect fill="white" height="10.8958" width="10.8958"/></clipPath></defs></svg>
                  <span className="font-semibold text-[7.62703px] text-white tracking-[-0.0457622px] leading-[10.8958px]">Star-Gastgeber</span>
                </div>
                <div className="absolute border-[0.544788px] border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[5447.34px]" />
              </div>
            </div>
          </div>
          {/* Heart icon */}
          <div className="absolute left-[138.921px] top-[6.537px] w-[13.075px] h-[13.075px]">
            <svg width="13.075" height="13.075" fill="none" viewBox="0 0 14 14"><g clipPath="url(#clip0_4_8303)"><path d="M10.7106 2.17369C9.27241 1.19308 7.4964 1.6507 6.53757 2.77296C5.57875 1.6507 3.80274 1.18763 2.3645 2.17369C1.60179 2.69669 1.12238 3.57925 1.08969 4.51084C1.01342 6.62461 2.88749 8.3189 5.74763 10.9175L5.80211 10.9666C6.21615 11.3425 6.85355 11.3425 7.26759 10.9611L7.32752 10.9066C10.1877 8.31346 12.0563 6.61917 11.9855 4.50539C11.9528 3.57925 11.4734 2.69669 10.7106 2.17369ZM6.59205 10.1058L6.53757 10.1603L6.48309 10.1058C3.8899 7.75777 2.17927 6.20513 2.17927 4.63069C2.17927 3.54111 2.99645 2.72393 4.08603 2.72393C4.64534 2.72393 5.29364 3.1525 6.03092 4.00963L6.53757 4.54973L7.04967 4.00963C7.78332 3.1525 8.4298 2.72393 8.98912 2.72393C10.0787 2.72393 10.8959 3.54111 10.8959 4.63069C10.8959 6.20513 9.18524 7.75777 6.59205 10.1058Z" fill="#fff" fillRule="evenodd"/><path d="M6.53746 10.1603L6.59194 10.1058C9.18513 7.75778 10.8958 6.20514 10.8958 4.6307C10.8958 3.54112 10.0786 2.72394 8.989 2.72394C8.42969 2.72394 7.78321 3.15251 7.04956 4.00964L6.53746 4.54974L6.0308 4.00964C5.29352 3.15251 4.64523 2.72394 4.08591 2.72394C2.99633 2.72394 2.17915 3.54112 2.17915 4.6307C2.17915 6.20514 3.88979 7.75778 6.48298 10.1058L6.53746 10.1603Z" fill="#1D1D1D" fillOpacity="0.5"/></g><defs><clipPath id="clip0_4_8303"><rect fill="white" height="13.0749" width="13.0749"/></clipPath></defs></svg>
          </div>
          {/* Chevron icon */}
          <div className="absolute left-[140.011px] top-[61.06px] w-[17.433px] h-[17.433px]">
            <svg width="17.433" height="17.433" fill="none" viewBox="0 0 18 18"><g id="chevron-right"><path d="M6.94087 5.06683C7.09554 4.91216 7.33278 4.89246 7.50825 5.00823L7.57954 5.06683L10.9135 8.40081C11.0684 8.55566 11.0883 8.79364 10.9721 8.96917L10.9135 9.03948L7.57954 12.3735C7.42467 12.5283 7.18672 12.5483 7.01118 12.4321L6.94087 12.3735C6.78926 12.2154 6.77019 11.9725 6.88325 11.7983L6.94087 11.728L9.75923 8.9096L9.95161 8.71624L6.94087 5.7055C6.76396 5.52859 6.76396 5.24374 6.94087 5.06683Z" fill="#fff" stroke="#fff" strokeWidth="0.545"/></g></svg>
          </div>
          {/* Casa Rio tag */}
          <div className="absolute left-[117.674px] top-[220.094px] bg-[#ffffff] rounded-[9078.89px]">
            <div className="flex flex-row gap-[2.179px] items-center px-[3.269px] py-[1.09px]">
              <span className="font-medium text-[#45423e] text-[6.53746px] leading-[8.71661px]">Casa Rio</span>
            </div>
          </div>
        </div>
      </div>
      {/* Main content */}
      <div className="flex-1 flex flex-col justify-between px-[13.075px] py-[6.537px] w-[269.125px]">
        {/* Title */}
        <div className="font-bold text-[8.717px] text-[#2b2926] leading-[13.075px] tracking-[-0.096px] mb-[4.358px]">Ferienhaus Sommerberg</div>
        {/* Location */}
        <div className="flex flex-row items-center gap-[2.179px] mb-[4.358px]">
          <svg width="8.717" height="8.717" fill="none" viewBox="0 0 9 9">
            <g id="location">
              <path d="M4.35804 0.998834C5.61304 0.998834 6.62836 2.01341 6.62855 3.26837C6.62855 3.94674 6.26188 4.79348 5.78187 5.59844C5.42682 6.1938 5.02507 6.74113 4.7096 7.14337L4.42835 7.49297C4.40099 7.52542 4.35794 7.53383 4.32288 7.51739L4.29163 7.49297C3.96547 7.1005 3.40892 6.39117 2.93519 5.59747C2.45488 4.79267 2.08851 3.94662 2.08851 3.26837C2.0887 2.01353 3.10321 0.999024 4.35804 0.998834ZM4.35804 2.08868C3.70668 2.08887 3.17854 2.617 3.17835 3.26837C3.17835 3.91989 3.70656 4.44884 4.35804 4.44903C5.00969 4.44903 5.53871 3.92001 5.53871 3.26837C5.53851 2.61688 5.00957 2.08868 4.35804 2.08868Z" fill={primary} stroke={primary} strokeWidth="0.545"/>
            </g>
          </svg>
          <span className="font-bold text-[7.627px] tracking-[-0.0458px] leading-[10.896px]" style={{ color: primary }}>Altensteig</span>
        </div>
        {/* Facilities row 1 */}
        <div className="flex flex-row items-center gap-[5.448px] mb-[4.358px]">
          <span className="text-[6.537px] text-[#45423e] leading-[8.717px]">Platz für 8 Pers.</span>
          <span className="w-[1.09px] h-[8.717px] bg-[#afaaa5] rounded-[0.545px]" />
          <span className="text-[6.537px] text-[#45423e] leading-[8.717px]">4 Schlafzimmer</span>
          <span className="w-[1.09px] h-[8.717px] bg-[#afaaa5] rounded-[0.545px]" />
          <span className="text-[6.537px] text-[#45423e] leading-[8.717px]">124 m²</span>
        </div>
        {/* Facilities row 2 */}
        <div className="flex flex-row items-center gap-[5.448px] mb-[4.358px]">
          <span className="text-[6.537px] text-[#45423e] leading-[8.717px]">WLAN</span>
          <span className="w-[1.09px] h-[8.717px] bg-[#afaaa5] rounded-[0.545px]" />
          <span className="text-[6.537px] text-[#45423e] leading-[8.717px]">Parkmöglichkeit</span>
          <span className="w-[1.09px] h-[8.717px] bg-[#afaaa5] rounded-[0.545px]" />
          <span className="text-[6.537px] text-[#45423e] leading-[8.717px]">Balkon/Terrasse</span>
          <span className="w-[1.09px] h-[8.717px] bg-[#afaaa5] rounded-[0.545px]" />
          <span className="text-[6.537px] text-[#45423e] leading-[8.717px]">Küche</span>
        </div>
        {/* Free cancellation */}
        <div className="font-bold text-[7.627px] text-[#038600] tracking-[-0.0458px] leading-[10.896px] mb-[4.358px]">KOSTENLOSE Stornierung</div>
        {/* Tag - Bergblick badge Figma accurate */}
        <span className="inline-flex self-start items-center border-[#d1ccc7] border-[0.544788px] border-solid rounded-[2.17915px] bg-[#fff] px-[4.358px] py-[2.179px] gap-[2.179px] mb-[4.358px]">
          <svg width="13.075" height="13.075" fill="none" viewBox="0 0 14 14"><g id="mountain-view"><g id="Vector"><path clipRule="evenodd" d="M7.9229 0.817687C8.10455 0.825498 8.27032 0.923408 8.36485 1.07871L12.1784 7.34377C12.3348 7.60078 12.2533 7.93595 11.9963 8.09239C11.7393 8.24883 11.4041 8.1673 11.2477 7.9103L9.23447 4.60291L8.22076 5.34308C8.00394 5.50139 7.70411 5.47815 7.51427 5.28832L6.46513 4.23917L5.43675 5.64151L6.45989 7.34674C6.61469 7.60474 6.53103 7.93938 6.27303 8.09419C6.01503 8.24899 5.68038 8.16532 5.52558 7.90732L4.96796 6.97795L3.78483 7.56952C3.60702 7.65842 3.3949 7.64342 3.23138 7.53036L2.1188 6.76118L1.54791 7.64924C1.3852 7.90233 1.04814 7.97561 0.795044 7.8129C0.541952 7.6502 0.468676 7.31313 0.631378 7.06004L3.08292 3.24652C3.18478 3.08808 3.36127 2.99349 3.54961 2.9964C3.73795 2.99931 3.91143 3.09931 4.00834 3.26083L4.82873 4.62814L7.46018 1.0398C7.56769 0.893191 7.74126 0.809875 7.9229 0.817687ZM7.11704 3.35019L7.95492 4.18807L8.66594 3.66891L7.85741 2.3406L7.11704 3.35019ZM2.70833 5.84413L3.58586 6.45082L4.40572 6.04089L3.52523 4.5734L2.70833 5.84413Z" fill="#2B2926" fillRule="evenodd"/><path d="M1.63443 8.71661C1.33355 8.71661 1.08964 8.96052 1.08964 9.2614C1.08964 9.56227 1.33355 9.80619 1.63443 9.80619H2.45161V11.1682C2.45161 11.469 2.69552 11.7129 2.9964 11.7129C3.29728 11.7129 3.54119 11.469 3.54119 11.1682V9.80619H9.26146V11.1682C9.26146 11.469 9.50537 11.7129 9.80625 11.7129C10.1071 11.7129 10.351 11.469 10.351 11.1682V9.80619H11.1682C11.4691 9.80619 11.713 9.56227 11.713 9.2614C11.713 8.96052 11.4691 8.71661 11.1682 8.71661H1.63443Z" fill="#2B2926"/></g></g></svg>
          <span className="font-bold text-[#414141] text-[7.62703px] tracking-[-0.0817182px] leading-[10.8958px]">Bergblick</span>
        </span>
        {/* Reviews */}
        <div className="flex flex-row items-center gap-[4.358px] mb-[4.358px]">
          <div className="flex flex-row items-center rounded-full px-[6.537px] py-[2.179px] gap-[2.179px]" style={{ background: primary }}>
            <svg width="8.717" height="8.717" fill="none" viewBox="0 0 9 9"><g id="star-filled"><path clipRule="evenodd" d="M4.35842 0.726373C4.50838 0.726373 4.64293 0.818547 4.69709 0.958392L5.47656 2.97091L7.64625 3.08524C7.79657 3.09316 7.92643 3.19299 7.97273 3.33622C8.01903 3.47945 7.97217 3.6364 7.85493 3.73081L6.1692 5.0882L6.72931 7.16945C6.76834 7.31447 6.71408 7.46856 6.5928 7.55713C6.47151 7.64571 6.30822 7.6505 6.18196 7.56918L4.3584 6.39487L2.53486 7.56917C2.40859 7.65048 2.2453 7.64569 2.12402 7.55712C2.00274 7.46854 1.94848 7.31445 1.98751 7.16943L2.54761 5.08819L0.861899 3.7308C0.744654 3.63639 0.697799 3.47944 0.744097 3.33621C0.790395 3.19298 0.920251 3.09315 1.07057 3.08523L3.24028 2.9709L4.01974 0.958392C4.0739 0.818547 4.20845 0.726373 4.35842 0.726373Z" fill="#fff" fillRule="evenodd"/></g></svg>
            <span className="font-semibold text-[6.537px] text-white leading-[8.717px]">10 · Fantastisch</span>
          </div>
          <span className="text-[6.537px] text-[#45423e] leading-[8.717px]">32 Bewertungen</span>
          <span className="font-bold text-[6.537px] text-[#414141] leading-[8.717px]">9.8</span>
          <span className="text-[6.537px] text-[#45423e] leading-[8.717px]">Hervorragende Lage</span>
        </div>
      </div>
      {/* Right section: Price and button */}
      <div className="flex flex-col items-end justify-between w-[102.42px] h-full pl-0 pr-[6.537px] py-[6.537px]">
        <div className="flex flex-col items-end">
          {/* Discount tag - Figma accurate */}
          <div className="relative bg-[rgba(3,134,0,0.1)] rounded-[9078.89px] mb-[4.358px]">
            <div className="absolute border-[#038600] border-[0.544788px] border-solid inset-0 pointer-events-none rounded-[9078.89px]" />
            <div className="relative flex flex-row gap-[4.358px] items-start justify-start px-[4.358px] py-[2.179px]">
              <span className="font-medium font-sans text-[#038600] text-[6.53746px] leading-[8.71661px] text-left whitespace-nowrap" style={{ fontFamily: 'Inter, sans-serif' }}>
                Rabatt bei Langzeitaufenthalt
              </span>
            </div>
          </div>
          <span className="text-[7.627px] text-[#605c57] tracking-[-0.0458px] leading-[10.896px] mb-[4.358px]">7 Nächte</span>
          <span className="font-bold text-[9.806px] text-[#45423e] tracking-[-0.137px] leading-[15.254px] mb-[4.358px]">1264 €</span>
        </div>
        <button
          className="w-[95.883px] h-[26.15px] rounded-[3.269px] flex items-center justify-center px-[13.075px] py-[6.537px] mt-auto transition-colors"
          style={{ background: ctaBg, color: ctaText, transition: 'background 0.2s' }}
          onMouseEnter={() => setCtaHovered(true)}
          onMouseLeave={() => setCtaHovered(false)}
        >
          <span className="font-bold text-[9.645px] tracking-[-0.135px] leading-[15.003px]">Mehr Details</span>
        </button>
      </div>
    </div>
  );
}

// Context to provide container width
const ContainerWidthContext = createContext<{container: number, sidebar: number} | undefined>(undefined);

// Refactor ContainerWidthProvider to only provide context and outer div
function ContainerWidthProvider({ children, sidebarRef }: { children: React.ReactNode, sidebarRef: React.RefObject<HTMLDivElement> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [widths, setWidths] = useState<{container: number, sidebar: number}>({container: 0, sidebar: 0});

  useEffect(() => {
    function handleResize() {
      setWidths({
        container: containerRef.current?.offsetWidth || 0,
        sidebar: sidebarRef.current?.offsetWidth || 0,
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarRef]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#f7f5f3] flex flex-row font-sans w-full">
      <ContainerWidthContext.Provider value={widths}>
        {children}
      </ContainerWidthContext.Provider>
    </div>
  );
}

function ScalablePreview({ children, margin = 32, verticalMargin = 64 }: { children: React.ReactNode; margin?: number; verticalMargin?: number }) {
  const widths = useContext(ContainerWidthContext);
  const previewWidth = 785;
  const [contentHeight, setContentHeight] = useState(430); // fallback initial value
  const contentRef = useRef<HTMLDivElement>(null);

  // Measure the actual content height
  useLayoutEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.offsetHeight);
    }
  }, [children, widths]);

  const availableWidth = widths ? widths.container - widths.sidebar - margin * 2 : previewWidth;
  const availableHeight = typeof window !== 'undefined'
    ? window.innerHeight - verticalMargin * 2
    : contentHeight;

  const maxPreviewWidth = 1300;
  const scaleW = Math.min(availableWidth, maxPreviewWidth) / previewWidth;
  const scaleH = availableHeight / contentHeight;
  const scale = Math.min(scaleW, scaleH);

  return (
    <div
      style={{
        width: "100%",
        maxWidth: '1300px',
        margin: '0 auto',
        minHeight: contentHeight * scale,
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
      }}
    >
      <div
        ref={contentRef}
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
          width: previewWidth,
          maxWidth: maxPreviewWidth,
          marginLeft: margin,
          marginRight: margin,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// App component renders sidebar and main, and uses ContainerWidthProvider for layout
export default function App() {
  const [primary, setPrimary] = useState("#00809d");
  const [cta, setCta] = useState("#ff6b6b");
  const [copied, setCopied] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;
  const [ctaText, setCtaText] = useState('#fff');

  const primaryHover = chroma(primary).darken(0.7).hex();
  const ctaHover = chroma(cta).darken(0.7).hex();

  const palette = {
    Primary: { default: primary, hover: primaryHover },
    CTA: { default: cta, hover: ctaHover, text: ctaText },
  };

  const handlePrimaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.value;
    setPrimary(getAccessiblePrimary(picked));
  };

  const handleCtaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.value;
    const { color, text } = getAccessibleCtaAndText(picked);
    setCta(color);
    setCtaText(text);
  };

  const primaryText = getContrastText(primary);
  const primaryHoverBg = chroma(primary).darken(0.7).hex();

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(palette, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <ContainerWidthProvider sidebarRef={sidebarRef}>
      {/* Left Panel */}
      <aside ref={sidebarRef} className="w-[400px] min-h-screen flex flex-col items-start px-12 py-16 bg-white border-r border-[#eee]">
        <h2 className="text-lg font-bold mb-2">1. Pick the colors for your website</h2>
        <p className="mb-6 text-[#2b2926]">If a selected color doesn't meet accessibility contrast standards, the color picker will automatically adjust it to the closest accessible option.</p>
        <div className="flex flex-row gap-6 mb-2">
          {/* Color 1 Picker Card */}
          <div
            className="bg-[#f7f5f3] rounded-[20px] p-[12px] flex flex-col items-start justify-start cursor-pointer transition outline-none hover:bg-[#f9fafb] focus-visible:bg-[#f9fafb] hover:shadow-[0_4px_24px_0_rgba(0,128,157,0.15)] focus-visible:shadow-[0_4px_24px_0_rgba(0,128,157,0.15)] hover:scale-102 focus-visible:scale-102"
            tabIndex={0}
            onClick={() => document.getElementById('color1-picker')?.click()}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); document.getElementById('color1-picker')?.click(); } }}
            aria-label="Pick color 1"
          >
            <input
              type="color"
              value={primary}
              onChange={handlePrimaryChange}
              className="w-0 h-0 opacity-0 absolute"
              aria-label="Pick color 1"
              id="color1-picker"
            />
            <div
              className="h-20 w-[100px] rounded-[16px] mb-2 cursor-pointer border-2 border-[#eee]"
              style={{ background: primary }}
              tabIndex={0}
              onClick={() => document.getElementById('color1-picker')?.click()}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('color1-picker')?.click(); }}
            />
            <div className="flex flex-row items-center gap-2">
              {/* Edit icon */}
              <svg className="shrink-0" width="20" height="20" viewBox="0 0 17 17" fill="none"><path clipRule="evenodd" d="M10.2244 1.10532C11.6981 -0.36844 14.0876 -0.368442 15.5613 1.10532C17.0351 2.57909 17.0351 4.96853 15.5613 6.44229L5.94644 16.0572C5.5562 16.4474 5.02693 16.6667 4.47504 16.6667H2.08087C0.931637 16.6667 0 15.735 0 14.5858V12.1916C0 11.6397 0.219235 11.1105 0.609474 10.7202L10.2244 1.10532ZM14.3828 2.28383C13.5599 1.46094 12.2258 1.46094 11.4029 2.28383L11.1605 2.52627L14.1404 5.50622L14.3828 5.26378C15.2057 4.44089 15.2057 3.10672 14.3828 2.28383ZM12.9619 6.68473L9.98194 3.70478L1.78798 11.8987C1.71031 11.9764 1.66667 12.0818 1.66667 12.1916V14.5858C1.66667 14.8146 1.85211 15 2.08087 15H4.47504C4.5849 15 4.69025 14.9564 4.76793 14.8787L12.9619 6.68473Z" fill="#2B2926" fillRule="evenodd"/></svg>
              <span className="font-semibold font-sans text-[16px] leading-[24px] tracking-[-0.176px] text-[#2b2926]">Color 1</span>
            </div>
          </div>
          {/* Color 2 Picker Card */}
          <div
            className="bg-[#f7f5f3] rounded-[20px] p-[12px] flex flex-col items-start justify-start cursor-pointer transition outline-none hover:bg-[#f9fafb] focus-visible:bg-[#f9fafb] hover:shadow-[0_4px_24px_0_rgba(0,128,157,0.15)] focus-visible:shadow-[0_4px_24px_0_rgba(0,128,157,0.15)] hover:scale-102 focus-visible:scale-102"
            tabIndex={0}
            onClick={() => document.getElementById('color2-picker')?.click()}
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); document.getElementById('color2-picker')?.click(); } }}
            aria-label="Pick color 2"
          >
            <input
              type="color"
              value={cta}
              onChange={handleCtaChange}
              className="w-0 h-0 opacity-0 absolute"
              aria-label="Pick color 2"
              id="color2-picker"
            />
            <div
              className="h-20 w-[100px] rounded-[16px] mb-2 cursor-pointer border-2 border-[#eee]"
              style={{ background: cta }}
              tabIndex={0}
              onClick={() => document.getElementById('color2-picker')?.click()}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('color2-picker')?.click(); }}
            />
            <div className="flex flex-row items-center gap-2">
              {/* Edit icon */}
              <svg className="shrink-0" width="20" height="20" viewBox="0 0 17 17" fill="none"><path clipRule="evenodd" d="M10.2244 1.10532C11.6981 -0.36844 14.0876 -0.368442 15.5613 1.10532C17.0351 2.57909 17.0351 4.96853 15.5613 6.44229L5.94644 16.0572C5.5562 16.4474 5.02693 16.6667 4.47504 16.6667H2.08087C0.931637 16.6667 0 15.735 0 14.5858V12.1916C0 11.6397 0.219235 11.1105 0.609474 10.7202L10.2244 1.10532ZM14.3828 2.28383C13.5599 1.46094 12.2258 1.46094 11.4029 2.28383L11.1605 2.52627L14.1404 5.50622L14.3828 5.26378C15.2057 4.44089 15.2057 3.10672 14.3828 2.28383ZM12.9619 6.68473L9.98194 3.70478L1.78798 11.8987C1.71031 11.9764 1.66667 12.0818 1.66667 12.1916V14.5858C1.66667 14.8146 1.85211 15 2.08087 15H4.47504C4.5849 15 4.69025 14.9564 4.76793 14.8787L12.9619 6.68473Z" fill="#2B2926" fillRule="evenodd"/></svg>
              <span className="font-semibold font-sans text-[16px] leading-[24px] tracking-[-0.176px] text-[#2b2926]">Color 2</span>
            </div>
          </div>
        </div>
        <h2 className="text-lg font-bold mt-10 mb-2">2. Share your colors</h2>
        <p className="mb-6 text-[#2b2926]">Click the "Copy Colors" button below to copy your selection. Then, please share it with us so we can apply it to your website.</p>
        <pre className="bg-[#f7f5f3] rounded-xl p-4 text-sm text-[#2b2926] w-full mb-4 border border-[#eee] whitespace-pre-wrap">
{JSON.stringify(palette, null, 2)}
        </pre>
        <button
          className="mt-2 px-6 py-2 rounded-lg border border-[#d1ccc7] bg-white font-semibold text-[#2b2926] flex items-center gap-2 hover:bg-[#f7f5f3] transition"
          onClick={handleCopy}
        >
<svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M13.2017 17.0981H4.86833V6.26481C4.86833 5.80648 4.49333 5.43148 4.03499 5.43148C3.57666 5.43148 3.20166 5.80648 3.20166 6.26481V17.0981C3.20166 18.0148 3.95166 18.7648 4.86833 18.7648H13.2017C13.66 18.7648 14.035 18.3898 14.035 17.9315C14.035 17.4731 13.66 17.0981 13.2017 17.0981ZM17.3683 13.7648V3.76481C17.3683 2.84814 16.6183 2.09814 15.7017 2.09814H8.20166C7.28499 2.09814 6.53499 2.84814 6.53499 3.76481V13.7648C6.53499 14.6815 7.28499 15.4315 8.20166 15.4315H15.7017C16.6183 15.4315 17.3683 14.6815 17.3683 13.7648ZM15.7017 13.7648H8.20166V3.76481H15.7017V13.7648Z" fill="#2B2926"/>
</svg>
          {copied ? "Copied!" : "Copy colors"}
        </button>
      </aside>
      {/* Right Panel */}
      <main className="flex-1 flex flex-col items-center py-16 px-8 w-full">
        <h2 className="text-xl font-bold mb-8">Your website preview</h2>
        <ScalablePreview margin={32}>
          <div className="rounded-2xl shadow-xl bg-white w-[785px] flex flex-col p-0 overflow-hidden">
            {/* Top bar - Figma search bar */}
            <div className="relative w-full h-[41.40px]">
              <div className="absolute inset-0 rounded-t-2xl" style={{ background: primary }} />
              <div className="absolute left-[43.58px] top-0 w-[505.56px] h-full flex flex-row gap-[4.36px] items-center px-[8.72px] py-[6.54px]">
                {/* Search input */}
                <div className="bg-white h-[28.33px] rounded-[3.27px] flex items-center w-[245.16px] px-[4.36px] gap-[8.72px]">
                  <svg width="13" height="13" fill="none" viewBox="0 0 14 14" className="text-[#2B2926]"><g id="search"><path d="M5.39093 1.91333L5.58918 1.93188C6.90663 2.09186 8.01604 3.08416 8.34406 4.35766L8.39875 4.61645C8.56972 5.63841 8.25851 6.59842 7.65461 7.30298L7.49152 7.49145L7.30304 7.65454C6.59835 8.25856 5.63773 8.56988 4.61554 8.39868H4.61652C3.30782 8.17743 2.24339 7.1371 1.97492 5.84985L1.93195 5.58911C1.67844 3.52689 3.35079 1.78219 5.39093 1.91333ZM5.17511 2.45141C3.66851 2.45166 2.45172 3.66844 2.45148 5.17505C2.45148 6.68186 3.66836 7.89942 5.17511 7.89966C6.68208 7.89966 7.89972 6.68201 7.89972 5.17505C7.89948 3.66829 6.68193 2.45141 5.17511 2.45141ZM7.89972 7.90356L7.82355 7.82446L7.79328 7.79321L7.82453 7.82348L7.90363 7.89966H8.33136L10.5609 10.1399L10.5618 10.1409C10.6784 10.2578 10.6784 10.4497 10.5618 10.5666C10.4448 10.6836 10.2521 10.6836 10.1351 10.5666L7.89972 8.3313V7.90356Z" fill="#2B2926" stroke="#2B2926" strokeWidth="0.54"/></g></svg>
                  <div className="flex flex-col leading-none">
                    <span className="font-[400] font-sans text-[#2B2926] text-[5.45px] leading-[6.54px]">REISEZIEL</span>
                    <span className="font-bold font-sans text-[#2B2926] text-[8.72px] leading-[13.07px] tracking-[-0.09588px]">Schwarzwald</span>
                  </div>
                </div>
                {/* Calendar input */}
                <div className="bg-white h-[28.33px] rounded-[3.27px] flex items-center w-[143.82px] px-[4.36px] gap-[8.72px]">
                  <svg width="13" height="13" fill="none" viewBox="0 0 14 14" className="text-[#2B2926]"><g id="calendar"><path d="M8.98899 0.817249C9.13943 0.817249 9.26145 0.939271 9.26145 1.08971V1.90709H9.80637C10.8593 1.90719 11.7125 2.76041 11.7126 3.81334V9.80651C11.7124 10.8594 10.8593 11.7127 9.80637 11.7128H3.26829C2.21552 11.7125 1.36221 10.8593 1.36204 9.80651V3.81334C1.36213 2.7605 2.21547 1.90733 3.26829 1.90709H3.81321V1.08971C3.81321 0.939351 3.93534 0.817379 4.08567 0.817249C4.23611 0.817249 4.35813 0.939271 4.35813 1.08971V1.90709H8.71653V1.08971C8.71653 0.939275 8.83856 0.817256 8.98899 0.817249ZM1.90696 9.80651C1.90713 10.5584 2.5164 11.1676 3.26829 11.1678H9.80637C10.5584 11.1677 11.1675 10.5585 11.1677 9.80651V5.72057H1.90696V9.80651ZM9.26145 7.35436V7.89928H8.71653V7.35436H9.26145ZM6.81028 7.35436V7.89928H6.26536V7.35436H6.81028ZM4.35813 7.35436V7.89928H3.81321V7.35436H4.35813ZM3.26829 2.45201C2.51635 2.45225 1.90705 3.06137 1.90696 3.81334V5.17565H11.1677V3.81334C11.1676 3.06129 10.5584 2.45212 9.80637 2.45201H9.26145V3.51061C9.26145 3.66105 9.13943 3.78307 8.98899 3.78307C8.83856 3.78306 8.71653 3.66097 8.71653 3.51061V2.45201H4.35813V3.51061C4.35813 3.66105 4.23611 3.78307 4.08567 3.78307C3.93534 3.78294 3.81321 3.66097 3.81321 3.51061V2.45201H3.26829Z" fill="#2B2926" stroke="#2B2926" strokeWidth="0.54"/></g></svg>
                  <div className="flex flex-col leading-none">
                    <span className="font-[400] font-sans text-[#2B2926] text-[5.45px] leading-[6.54px]">ANREISE & ABREISE</span>
                    <span className="font-bold font-sans text-[#2B2926] text-[8.72px] leading-[13.07px] tracking-[-0.09588px]">Do., 3. Juli - Do., 10. Juli</span>
                  </div>
                </div>
                {/* People input */}
                <div className="bg-white h-[28.33px] rounded-[3.27px] flex items-center w-[110.59px] px-[4.36px] gap-[8.72px]">
                  <svg width="13" height="13" fill="none" viewBox="0 0 14 14" className="text-[#2B2926]"><g id="people"><path clipRule="evenodd" d="M4.3583 2.17915C3.45567 2.17915 2.72394 2.91088 2.72394 3.81352C2.72394 4.71615 3.45567 5.44788 4.3583 5.44788C5.26094 5.44788 5.99267 4.71615 5.99267 3.81352C5.99267 2.91088 5.26094 2.17915 4.3583 2.17915ZM3.81352 3.81352C3.81352 3.51264 4.05743 3.26873 4.3583 3.26873C4.65918 3.26873 4.90309 3.51264 4.90309 3.81352C4.90309 4.11439 4.65918 4.3583 4.3583 4.3583C4.05743 4.3583 3.81352 4.11439 3.81352 3.81352Z" fill="#2B2926" fillRule="evenodd"/><path clipRule="evenodd" d="M1.08958 9.2614C1.08958 7.45613 2.55304 5.99267 4.3583 5.99267C6.16357 5.99267 7.62703 7.45613 7.62703 9.2614V9.44299C7.62703 9.94446 7.22052 10.351 6.71905 10.351H1.99756C1.49609 10.351 1.08958 9.94446 1.08958 9.44299V9.2614ZM4.3583 7.08224C3.15479 7.08224 2.17915 8.05788 2.17915 9.2614H6.53746C6.53746 8.05788 5.56182 7.08224 4.3583 7.08224Z" fill="#2B2926" fillRule="evenodd"/><path clipRule="evenodd" d="M7.08224 3.81352C7.08224 2.91088 7.81397 2.17915 8.71661 2.17915C9.61924 2.17915 10.351 2.91088 10.351 3.81352C10.351 4.71615 9.61924 5.44788 8.71661 5.44788C7.81397 5.44788 7.08224 4.71615 7.08224 3.81352ZM8.71661 3.26873C8.41573 3.26873 8.17182 3.51264 8.17182 3.81352C8.17182 4.11439 8.41573 4.3583 8.71661 4.3583C9.01749 4.3583 9.2614 4.11439 9.2614 3.81352C9.2614 3.51264 9.01749 3.26873 8.71661 3.26873Z" fill="#2B2926" fillRule="evenodd"/><path d="M11.0774 10.351H8.4988C8.63806 10.0786 8.71661 9.76995 8.71661 9.44299V9.2614H10.8958C10.8958 8.05788 9.92012 7.08224 8.71661 7.08224C8.52869 7.08224 8.34632 7.10603 8.17236 7.15076C7.98572 6.81421 7.75583 6.50497 7.49019 6.23053C7.8689 6.07714 8.28289 5.99267 8.71661 5.99267C10.5219 5.99267 11.9853 7.45613 11.9853 9.2614V9.44299C11.9853 9.94446 11.5788 10.351 11.0774 10.351Z" fill="#2B2926"/></g></svg>
                  <div className="flex flex-col leading-none">
                    <span className="font-bold font-sans text-[#7A7570] text-[8.72px] leading-[13.07px] tracking-[-0.09588px]">Gäste hinzufügen</span>
                  </div>
                </div>
              </div>
            </div>
            {/* End Figma search bar */}
            <div className="flex flex-row">
              {/* Filters - Figma pixel-perfect */}
              <aside className="w-[135.107px] mt-[13px] bg-white flex flex-col items-start relative ml-[52px]">
                {/* Map image */}
                <div className="w-[135.107px] h-[69.733px] overflow-hidden relative">
                  <img
                    src="/map-button-munich-bg.jpg"
                    alt="Map preview"
                    className="w-full h-full object-cover rounded-[3.269px]"
                    draggable="false"
                  />
                  {/* Karte ansehen button - centered over image */}
                  <button
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-[3.269px] flex items-center gap-[4.358px] px-[10.896px] py-[4.358px] h-[21.433px] text-white font-semibold text-[8.717px] leading-[13.075px] tracking-[-0.098px] z-10 transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif', background: primary, color: primaryText }}
                    onMouseEnter={e => e.currentTarget.style.background = primaryHoverBg}
                    onMouseLeave={e => e.currentTarget.style.background = primary}
                  >
                    <svg width="10.896" height="10.896" fill="none" viewBox="0 0 11 11"><g id="location"><path d="M5.4476 1.18045C7.05403 1.18045 8.35276 2.47931 8.35287 4.08573C8.35287 4.95336 7.88631 6.02439 7.28549 7.03201C6.69173 8.02774 5.99518 8.9165 5.58822 9.40897C5.51553 9.4962 5.38455 9.4962 5.31185 9.40897H5.31088C4.90197 8.91686 4.20499 8.02774 3.61068 7.03201C3.0093 6.02444 2.54232 4.95337 2.54232 4.08573C2.54243 2.47938 3.84125 1.18056 5.4476 1.18045ZM5.4476 2.6785C4.67081 2.6786 4.04048 3.30894 4.04037 4.08573C4.04037 4.86261 4.67074 5.49285 5.4476 5.49295C6.22454 5.49295 6.85482 4.86267 6.85482 4.08573C6.85472 3.30887 6.22448 2.6785 5.4476 2.6785Z" fill="#fff" stroke="#fff" strokeWidth="0.545"/></g></svg>
                    <span className="font-semibold">Karte ansehen</span>
                  </button>
                </div>
                {/* Reset filters button - between map and filters, outside map container */}
                <button
                  className="mt-[13px] w-[126.391px] rounded-[3.269px] flex items-center justify-center gap-[4.358px] px-[13.075px] py-[4.358px] h-[21.433px] text-white text-[7.627px] leading-[10.896px] tracking-[-0.046px] font-normal transition-colors z-10"
                  style={{ fontFamily: 'Inter, sans-serif', background: primary, color: primaryText }}
                  onMouseEnter={e => e.currentTarget.style.background = primaryHoverBg}
                  onMouseLeave={e => e.currentTarget.style.background = primary}
                >
                  Alle Filter zurücksetzen
                  <svg width="10.896" height="10.896" fill="none" viewBox="0 0 11 11"><g id="close"><path d="M2.98 2.74L3.04 2.78L5.45 5.19L5.64 5L7.86 2.79C7.93 2.71 8.04 2.71 8.12 2.79C8.16 2.83 8.18 2.91 8.15 2.98L8.12 3.04L5.9 5.26L5.7 5.45L8.12 7.86C8.19 7.93 8.19 8.04 8.12 8.12C8.06 8.17 7.98 8.18 7.92 8.16L7.86 8.12L5.45 5.7L5.26 5.9L3.04 8.12C2.96 8.19 2.85 8.19 2.78 8.12C2.73 8.06 2.71 7.98 2.74 7.92L2.78 7.86L5 5.64L5.19 5.45L2.78 3.04C2.71 2.96 2.71 2.85 2.78 2.78C2.83 2.73 2.91 2.71 2.98 2.74Z" fill="#fff" stroke="#fff" strokeWidth="0.545"/></g></svg>
                </button>
                {/* Filter groups - restored */}
                <div className="flex flex-col gap-[13.075px] w-full pl-0 pr-0 mt-[13px]">
                  {/* Beliebte Filter */}
                  <div>
                    <div className="text-[8.717px] font-bold text-[#2b2926] leading-[13.075px] tracking-[-0.096px] pl-[4.358px] pb-[6.537px]" style={{ fontFamily: 'Inter, sans-serif' }}>Beliebte Filter</div>
                    <div className="flex flex-col gap-0">
                      {[
                        { label: 'Haustiere erlaubt', checked: false },
                        { label: 'Ferienhaus', checked: true },
                        { label: 'Ferienwohnung', checked: false },
                        { label: 'Hütte', checked: false },
                        { label: 'Chalet', checked: false },
                        { label: 'WLAN', checked: false },
                        { label: 'Parkmöglichkeit', checked: false },
                        { label: 'Balkon/Terrasse', checked: false },
                        { label: 'Bauernhof', checked: false },
                      ].map(({ label, checked }) => (
                        <label key={label} className="flex flex-row items-center gap-[4.358px] px-[4.358px] py-[3.269px] cursor-default select-none">
                          <input
                            type="checkbox"
                            checked={checked}
                            readOnly
                            className="w-[10.896px] h-[10.896px] border-[0.545px] rounded-[2.179px] focus:ring-0 focus:outline-none cursor-default"
                            style={{ accentColor: checked ? primary : '#afaaa5', borderColor: checked ? primary : '#afaaa5' }}
                          />
                          <span className="text-[7.627px] text-[#2b2926] font-normal leading-[10.896px] tracking-[-0.046px]" style={{ fontFamily: 'Inter, sans-serif' }}>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {/* Art der Unterkunft */}
                  <div>
                    <div className="text-[8.717px] font-bold text-[#2b2926] leading-[13.075px] tracking-[-0.096px] pl-[4.358px] pb-[6.537px]" style={{ fontFamily: 'Inter, sans-serif' }}>Art der Unterkunft</div>
                    <div className="flex flex-col gap-0">
                      {[
                        'Ferienhaus',
                        'Ferienwohnung',
                        'Hütte',
                        'Chalet',
                      ].map(label => (
                        <label key={label} className="flex flex-row items-center gap-[4.358px] px-[4.358px] py-[3.269px] cursor-default select-none">
                          <input
                            type="checkbox"
                            checked={false}
                            readOnly
                            className="w-[10.896px] h-[10.896px] border-[0.545px] rounded-[2.179px] focus:ring-0 focus:outline-none cursor-default"
                            style={{ accentColor: '#afaaa5', borderColor: '#afaaa5' }}
                          />
                          <span className="text-[7.627px] text-[#2b2926] font-normal leading-[10.896px] tracking-[-0.046px]" style={{ fontFamily: 'Inter, sans-serif' }}>{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </aside>
              {/* Preview Cards - replace with Figma ListItem only */}
              <div className="flex-1 p-4 flex flex-col gap-2 overflow-y-auto bg-white">
                {/* Results Title section from Figma */}
                <div >
                  {/* Breadcrumbs */}
                  <div className="flex flex-row items-start pb-[4.358px] gap-0">
                    <span className="font-sans text-[7.627px] leading-[10.896px] tracking-[-0.0458px]" style={{ color: primary }}>Deutschland</span>
                    <svg className="mx-[2.179px]" width="10.896" height="10.896" fill="none" viewBox="0 0 11 11"><g id="chevron-right"><path d="M4.60535 3.1996L4.66492 3.23867L6.74891 5.32265C6.80192 5.37566 6.81545 5.4529 6.78895 5.51796L6.74891 5.57753L4.66492 7.66152C4.59504 7.73123 4.48374 7.73171 4.41297 7.66347C4.35874 7.60772 4.34633 7.52695 4.37196 7.46132L4.41004 7.40175L6.36414 5.44765L4.41004 3.49355C4.33958 3.42286 4.33943 3.30927 4.41004 3.23867C4.46308 3.18563 4.54027 3.17305 4.60535 3.1996Z" fill="#AFAAA5" stroke="#AFAAA5" strokeWidth="0.544788"/></g></svg>
                    <span className="font-sans text-[7.627px] leading-[10.896px] tracking-[-0.0458px]" style={{ color: primary }}>Baden-Württemberg</span>
                    <svg className="mx-[2.179px]" width="10.896" height="10.896" fill="none" viewBox="0 0 11 11"><g id="chevron-right"><path d="M4.60535 3.1996L4.66492 3.23867L6.74891 5.32265C6.80192 5.37566 6.81545 5.4529 6.78895 5.51796L6.74891 5.57753L4.66492 7.66152C4.59504 7.73123 4.48374 7.73171 4.41297 7.66347C4.35874 7.60772 4.34633 7.52695 4.37196 7.46132L4.41004 7.40175L6.36414 5.44765L4.41004 3.49355C4.33958 3.42286 4.33943 3.30927 4.41004 3.23867C4.46308 3.18563 4.54027 3.17305 4.60535 3.1996Z" fill="#AFAAA5" stroke="#AFAAA5" strokeWidth="0.544788"/></g></svg>
                    <span className="font-sans text-[7.627px] leading-[10.896px] tracking-[-0.0458px] text-[#2b2926]">Schwarzwald</span>
                  </div>
                  {/* Main title */}
                  <div className="font-bold font-sans text-[#2b2926] text-[13.075px] leading-[17.433px] tracking-[-0.163px] mb-0">Schwarzwald</div>
                  {/* Subtitle */}
                  <div className="font-semibold font-sans text-[#7a7570] text-[8.717px] leading-[13.075px] tracking-[-0.098px] mt-[4.358px]">6.365 Unterkünfte gefunden</div>
                </div>
                {/* End Results Title section */}
                <ListItem primary={primary} cta={cta} ctaText={ctaText} image="/image1.png" />
                <div
                  className="h-[1px] bg-[#eee] "
                  style={{ marginLeft: '172.153px', marginRight: '30.957px' }}
                />
                <ListItem primary={primary} cta={cta} ctaText={ctaText} image="/image2.png" />
                
              </div>
            </div>
          </div>
        </ScalablePreview>
      </main>
    </ContainerWidthProvider>
  );
}
