/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react'; // 1. Phải import cái này

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
}

export const Card = ({ children, className, title, subtitle, footer }: CardProps) => {
  return (
    <motion.div
      /* 2. HIỆU ỨNG TƯƠNG TÁC CHO TOÀN BỘ CARD */
      whileHover={{
        scale: 1.01,
        y: -5, // Nhấc nhẹ lên thay vì trượt ngang để hợp với giao diện Calendar/Todo
        rotateX: 2, // Nghiêng 3D nhẹ theo trục X
        rotateY: -2, // Nghiêng 3D nhẹ theo trục Y
      }}
      whileTap={{ scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25 // Tăng damping để chuyển động mượt, không bị nảy quá đà
      }}
      /* Style gốc của bạn */
      className={cn(
        'glass-card rounded-[32px] p-8 flex flex-col gap-6 border border-white/20 shadow-2xl cursor-pointer perspective-1000',
        className
      )}
    >
      {(title || subtitle) && (
        <div className="flex flex-col gap-2">
          {title && <h3 className="text-2xl font-black tracking-tight text-white italic uppercase">{title}</h3>}
          {subtitle && <p className="text-sm text-white/60 font-medium tracking-wide">{subtitle}</p>}
        </div>
      )}

      <div className="flex-1">
        {children}
      </div>

      {footer && (
        <div className="pt-6 border-t border-white/10 mt-auto">
          {footer}
        </div>
      )}
    </motion.div>
  );
};