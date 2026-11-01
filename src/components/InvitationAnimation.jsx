
import React, { useRef } from "react";

export default function InvitationAnimation() {
    const sceneRef = useRef(null);

    const handleMouseMove = (e) => {
        if (
            !sceneRef.current ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) return;

        const rect = sceneRef.current.getBoundingClientRect();

        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        sceneRef.current.style.setProperty("--mouse-x", `${x * 14}px`);
        sceneRef.current.style.setProperty("--mouse-y", `${y * 14}px`);
    };

    const resetMouse = () => {
        if (!sceneRef.current) return;

        sceneRef.current.style.setProperty("--mouse-x", "0px");
        sceneRef.current.style.setProperty("--mouse-y", "0px");
    };

    return (
        <div
            ref={sceneRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={resetMouse}
            className="relative isolate mx-auto flex h-[550px] w-full max-w-[620px] items-center justify-center overflow-hidden rounded-[30px] [perspective:1200px] [--mouse-x:0px] [--mouse-y:0px]"
        >
            {/* Background glow */}
            <div className="absolute left-1/2 top-1/2 -z-10 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-600/20 blur-[90px] animate-glow" />

            {/* Orbit rings */}
            <div className="absolute left-[5%] top-[42%] z-[4] h-[105px] w-[90%] rounded-[50%] border-y-2 border-amber-300/80 shadow-[0_0_12px_rgba(255,179,77,0.7)] animate-orbit pointer-events-none" />

            <div className="absolute left-[10%] top-[54%] z-[4] h-[75px] w-[80%] rounded-[50%] border-y border-purple-300/60 animate-orbit-reverse pointer-events-none" />

            {/* Birthday card */}
            <div
                className="absolute left-[47%] top-[20%] z-[1] flex h-[340px] w-[230px] flex-col items-center justify-center rounded-xl border border-purple-300 bg-gradient-to-br from-purple-800 to-[#17132f] text-center text-amber-100 shadow-[0_25px_60px_rgba(0,0,0,0.4)] animate-float-slow"
                style={{
                    transform: "translate(var(--mouse-x), var(--mouse-y)) rotate(13deg)"
                }}
            >
                <span className="mb-6 text-2xl">✦</span>
                <span className="mb-5 text-[8px] tracking-[3px]">A SPECIAL DAY</span>
                <h3 className="font-serif text-3xl leading-tight">
                    Let's<br />Celebrate!
                </h3>
                <span className="mt-6 text-2xl">✧ 🎂 ✧</span>
                <span className="absolute bottom-6 text-[8px] tracking-[2px]">
                    BIRTHDAY INVITATION
                </span>
            </div>

            {/* Celebration card */}
            <div
                className="absolute left-[38%] top-[16%] z-[2] flex h-[340px] w-[230px] flex-col items-center justify-center rounded-xl border-2 border-amber-300 bg-gradient-to-br from-[#fff3d9] to-[#f4d4bd] text-center text-[#5b321d] shadow-xl animate-float-medium"
                style={{
                    transform: "translate(var(--mouse-x), var(--mouse-y)) rotate(9deg)"
                }}
            >
                <span className="mb-6 text-2xl">✧</span>
                <span className="mb-5 text-[8px] tracking-[3px]">YOU ARE INVITED</span>
                <h3 className="font-serif text-3xl leading-tight">
                    Join the<br />Celebration
                </h3>
                <span className="mt-6 text-2xl">✦ ✨ ✦</span>
                <span className="absolute bottom-6 text-[8px] tracking-[2px]">
                    A MOMENT TO REMEMBER
                </span>
            </div>

            {/* Main wedding invitation */}
            <div
                className="absolute left-[17%] top-[12%] z-[3] h-[340px] w-[230px] rounded-xl border-2 border-amber-300 bg-gradient-to-br from-[#161b43] to-[#090e2a] p-[9px] text-amber-200 shadow-[0_25px_60px_rgba(0,0,0,0.5),0_0_25px_rgba(255,187,87,0.2)] animate-float-main"
                style={{
                    transform: "translate(var(--mouse-x), var(--mouse-y)) rotate(-8deg)"
                }}
            >
                <div className="relative flex h-full flex-col items-center justify-center overflow-hidden border border-amber-300/60 px-3 text-center">

                    <span className="absolute left-2 top-2 text-xl">❀</span>
                    <span className="absolute right-2 top-2 text-xl">❀</span>

                    <span className="text-[7px] tracking-[2px]">
                        TOGETHER WITH THEIR FAMILIES
                    </span>

                    <h2 className="mt-8 font-serif text-[43px] italic leading-[1.1] text-amber-200 drop-shadow-[0_0_15px_rgba(255,198,113,0.4)]">
                        You're<br />Invited
                    </h2>

                    <div className="mt-5 flex items-center gap-2 text-sm">
                        <span>────</span>
                        <span>♡</span>
                        <span>────</span>
                    </div>

                    <span className="mt-4 text-3xl">◯ ◯</span>

                    <span className="mt-5 text-[7px] tracking-[2px]">
                        A BEAUTIFUL BEGINNING
                    </span>

                    <span className="absolute bottom-2 left-2 text-xl">❀</span>
                    <span className="absolute bottom-2 right-2 text-xl">❀</span>
                </div>
            </div>

            {/* Floating decorations */}
            <span className="absolute right-[17%] top-[7%] z-[5] text-5xl drop-shadow-[0_0_12px_rgba(255,178,83,0.5)] animate-float-decoration">
                💌
            </span>

            <span className="absolute bottom-[21%] right-[8%] z-[5] text-4xl animate-float-decoration [animation-delay:-2s]">
                🎁
            </span>

            <span className="absolute bottom-[26%] left-[7%] z-[5] text-3xl animate-float-decoration [animation-delay:-1s]">
                🎀
            </span>

            <span className="absolute left-[21%] top-[12%] z-[5] text-4xl animate-float-decoration [animation-delay:-1.5s]">
                🌸
            </span>

            <span className="absolute bottom-[16%] left-[20%] z-[5] text-4xl animate-float-decoration [animation-delay:-2.5s]">
                🌺
            </span>

            {/* Sparkles */}
            {[
                "top-[12%] left-[8%]",
                "top-[35%] right-[8%]",
                "bottom-[12%] left-[12%]",
                "top-[18%] right-[32%]",
                "top-[60%] left-[5%]",
                "bottom-[20%] right-[18%]"
            ].map((position, i) => (
                <span
                    key={i}
                    className={`absolute z-[6] text-xl text-amber-300 drop-shadow-[0_0_10px_#ffb33d] animate-sparkle ${position}`}
                    style={{ animationDelay: `${i * 0.35}s` }}
                >
                    {i % 2 === 0 ? "✦" : "✧"}
                </span>
            ))}

            {/* Bottom glowing platform */}
            <div className="absolute bottom-[5%] left-[18%] h-10 w-[65%] rounded-[50%] border border-purple-400/40 shadow-[0_0_20px_rgba(135,75,255,0.4),inset_0_0_20px_rgba(135,75,255,0.25)] [transform:perspective(200px)_rotateX(55deg)]">
                <div className="absolute left-1/2 top-1/2 h-1 w-1/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-100 shadow-[0_0_15px_6px_#ffb74d] animate-platform-glow" />
            </div>
        </div>
    );
}
