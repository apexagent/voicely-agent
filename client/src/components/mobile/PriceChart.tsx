import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

interface PriceDataPoint {
  timestamp: number;
  price: number;
}

export default function PriceChart() {
  const [priceData, setPriceData] = useState<PriceDataPoint[]>([]);
  const [currentPrice, setCurrentPrice] = useState(0.0452);

  // Generate realistic price movement data
  useEffect(() => {
    const basePrice = 0.0452;
    const now = Date.now();
    const points: PriceDataPoint[] = [];
    
    // Generate 24 hours of data (hourly points)
    for (let i = 23; i >= 0; i--) {
      const variance = (Math.sin(i * 0.5) * 0.003) + (Math.random() * 0.002 - 0.001);
      points.push({
        timestamp: now - (i * 60 * 60 * 1000),
        price: basePrice + variance,
      });
    }
    
    setPriceData(points);
  }, []);

  // Animate live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrice(prev => {
        const change = (Math.random() - 0.48) * 0.0002;
        return Math.max(0.040, Math.min(0.050, prev + change));
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Update price data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setPriceData(prev => {
        const newPoint: PriceDataPoint = {
          timestamp: Date.now(),
          price: currentPrice,
        };
        return [...prev.slice(1), newPoint];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [currentPrice]);

  // Calculate SVG path for the chart
  const generatePath = () => {
    if (priceData.length < 2) return "";

    const width = 100;
    const height = 100;
    const padding = 5;

    const minPrice = Math.min(...priceData.map(d => d.price));
    const maxPrice = Math.max(...priceData.map(d => d.price));
    const priceRange = maxPrice - minPrice || 0.001;

    const points = priceData.map((point, i) => {
      const x = padding + ((width - 2 * padding) * i) / (priceData.length - 1);
      const y = height - padding - ((height - 2 * padding) * (point.price - minPrice)) / priceRange;
      return `${x},${y}`;
    });

    return `M ${points.join(" L ")}`;
  };

  const generateAreaPath = () => {
    if (priceData.length < 2) return "";

    const path = generatePath();
    const lastPoint = priceData[priceData.length - 1];
    const width = 100;
    const height = 100;

    return `${path} L ${width - 5},${height} L 5,${height} Z`;
  };

  const priceChange = priceData.length >= 2 
    ? ((priceData[priceData.length - 1].price - priceData[0].price) / priceData[0].price) * 100
    : 0;

  return (
    <div className="relative w-full h-48 rounded-3xl bg-black/80 border border-purple-500/30 backdrop-blur-xl overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex items-center justify-between">
          <div>
            <motion.div
              key={currentPrice}
              initial={{ scale: 1.1, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-black text-gray-100"
            >
              ${currentPrice.toFixed(4)}
            </motion.div>
            <div className="text-xs text-gray-500 font-mono mt-0.5">24H CHART</div>
          </div>
          <div className={`flex items-center gap-1 text-sm font-bold ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            <TrendingUp className={`w-4 h-4 ${priceChange < 0 ? 'rotate-180' : ''}`} />
            {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
          </div>
        </div>
      </div>

      {/* Animated Chart */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        style={{ top: '20%' }}
      >
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#8B5CF6', stopOpacity: 0.4 }} />
            <stop offset="50%" style={{ stopColor: '#06B6D4', stopOpacity: 0.2 }} />
            <stop offset="100%" style={{ stopColor: '#06B6D4', stopOpacity: 0 }} />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#8B5CF6' }} />
            <stop offset="50%" style={{ stopColor: '#06B6D4' }} />
            <stop offset="100%" style={{ stopColor: '#10B981' }} />
          </linearGradient>
        </defs>

        {/* Gradient Area */}
        <motion.path
          d={generateAreaPath()}
          fill="url(#areaGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Main Line */}
        <motion.path
          d={generatePath()}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="0.8"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Animated Dots on Data Points */}
        {priceData.slice(-5).map((point, i) => {
          const width = 100;
          const height = 100;
          const padding = 5;
          const minPrice = Math.min(...priceData.map(d => d.price));
          const maxPrice = Math.max(...priceData.map(d => d.price));
          const priceRange = maxPrice - minPrice || 0.001;

          const index = priceData.indexOf(point);
          const x = padding + ((width - 2 * padding) * index) / (priceData.length - 1);
          const y = height - padding - ((height - 2 * padding) * (point.price - minPrice)) / priceRange;

          return (
            <motion.circle
              key={point.timestamp}
              cx={x}
              cy={y}
              r="1"
              fill="#06B6D4"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          );
        })}

        {/* Live Pulse at Latest Point */}
        {priceData.length > 0 && (() => {
          const width = 100;
          const height = 100;
          const padding = 5;
          const minPrice = Math.min(...priceData.map(d => d.price));
          const maxPrice = Math.max(...priceData.map(d => d.price));
          const priceRange = maxPrice - minPrice || 0.001;

          const lastPoint = priceData[priceData.length - 1];
          const x = width - padding;
          const y = height - padding - ((height - 2 * padding) * (lastPoint.price - minPrice)) / priceRange;

          return (
            <motion.circle
              cx={x}
              cy={y}
              r="2"
              fill="#10B981"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })()}
      </svg>

      {/* Bottom Grid Lines */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute left-0 right-0 border-t border-purple-500/10"
            style={{ top: `${i * 33.33}%` }}
          />
        ))}
      </div>
    </div>
  );
}
