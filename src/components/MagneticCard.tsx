/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { cn } from '../lib/utils';

interface MagneticCardProps {
    children: React.ReactNode;
    className?: string;
}

export const MagneticCard = ({ children, className }: MagneticCardProps) => {
    const cardRef = useRef<HTMLDivElement | null>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Cấu hình Spring: Tăng stiffness (độ cứng) để nó phản hồi nhanh hơn, 
    // giảm mass để nó nhẹ hơn, không bị cảm giác "nặng nề/chậm".
    const springConfig = { stiffness: 200, damping: 20, mass: 0.3 };

    // SỬA TẠI ĐÂY: Chuyển [-0.1, 0.1] thành [-0.5, 0.5]
    // Điều này giúp card nghiêng mượt dần từ tâm ra đến tận rìa card.
    const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [20, -20]), springConfig);
    const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-20, 20]), springConfig);

    const mouseX = useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), springConfig);
    const mouseY = useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), springConfig);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();

        // Tính toán vị trí chuẩn xác
        const newX = (e.clientX - rect.left) / rect.width - 0.5;
        const newY = (e.clientY - rect.top) / rect.height - 0.5;

        x.set(newX);
        y.set(newY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <div className="perspective-1000 w-fit inline-block" style={{ perspective: '1000px' }}>
            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: 'preserve-3d',
                }}
                /* Bỏ transition-all duration-500 của CSS vì nó sẽ xung đột với Spring của Motion làm cho bị đơ */
                className={cn(
                    'relative overflow-hidden rounded-[32px] will-change-transform',
                    className
                )}
            >
                {/* Spotlight Effect - Tăng opacity để thấy rõ hơn */}
                <motion.div
                    className="pointer-events-none absolute inset-0 z-0 opacity-0 group-hover:opacity-100"
                    style={{
                        background: useTransform(
                            [mouseX, mouseY],
                            ([mx, my]) => `radial-gradient(350px circle at ${mx}% ${my}%, rgba(200, 200, 200, 0.18), transparent 80%)`
                        ),
                    }}
                />

                {/* Nội dung thực tế - Đẩy Z cao hơn để thấy độ sâu 3D */}
                <div style={{ transform: 'translateZ(50px)', transformStyle: 'preserve-3d' }} className="relative z-10">
                    {children}
                </div>
            </motion.div>
        </div>
    );
};