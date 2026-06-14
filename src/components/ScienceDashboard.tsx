import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { PLANETS, COSMIC_EVENTS, PERIODIC_TABLE, ERAS, PlanetInfo, CosmicEvent, ChemicalElement, EraMarker, EarthquakeItem } from '../types';
import { Sparkles, Globe, Orbit, HelpCircle, Activity, Heart, Eye, RefreshCw, BarChart2, Download, Search, ShieldAlert, BookOpen, Layers, TrendingUp, Sliders, Database, Trash2, Camera, Plus, AlertTriangle, Filter, Newspaper, Cpu } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, BarChart, Bar, Legend, Cell } from 'recharts';

export const ScienceDashboard: React.FC = () => {
  const { apiKeyNasa, addAuditLog } = useApp();

  // Active sub-section: astro, biochem, eon, stats
  const [activeTab, setActiveTab] = useState<'astro' | 'biochem' | 'eon' | 'stats'>('astro');

  // --- ASTROPHYSICS STATE ---
  const [apodLoading, setApodLoading] = useState(false);
  const [apodData, setApodData] = useState<any>(null);
  const [apodError, setApodError] = useState<string | null>(null);
  const [isApodModalOpen, setIsApodModalOpen] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetInfo | null>(PLANETS[2]);
  const [viewingCosmicCategory, setViewingCosmicCategory] = useState<'all' | 'origins' | 'evolution' | 'future'>('all');

  // --- NEWS ENGINE STATE ---
  const [newsCategory, setNewsCategory] = useState<'nasa' | 'tech'>('nasa');
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [newsSource, setNewsSource] = useState<string>('');

  // --- COSMIC PLANETARY GRAVITY LAB STATE ---
  const [earthWeightInput, setEarthWeightInput] = useState<number>(70);
  const [simY, setSimY] = useState<number>(0); // 0 to 1 representing position
  const [simTime, setSimTime] = useState<number>(0); // elapsed seconds
  const [isDropping, setIsDropping] = useState<boolean>(false);
  const [selectedDropObject, setSelectedDropObject] = useState<'apple' | 'astronaut' | 'satellite'>('apple');

  // --- BIOCHEM STATE ---
  const [activeElement, setActiveElement] = useState<ChemicalElement | null>(PERIODIC_TABLE[0]);
  const [activeBodyLayer, setActiveBodyLayer] = useState<'nervous' | 'circulatory' | 'skeletal'>('circulatory');

  // --- EARTH STATE (EARTHQUAKES & ERAS) ---
  const [seismicLoading, setSeismicLoading] = useState(false);
  const [seismicData, setSeismicData] = useState<EarthquakeItem[]>([]);
  const [selectedEra, setSelectedEra] = useState<EraMarker>(ERAS[5]); // Present Cenozoic

  // --- STATS STATE ---
  const [statsPairs, setStatsPairs] = useState<{ x: number; y: number }[]>([
    { x: 10, y: 12.5 },
    { x: 20, y: 18.2 },
    { x: 30, y: 31.0 },
    { x: 40, y: 28.5 },
    { x: 50, y: 42.0 },
    { x: 60, y: 56.4 },
    { x: 70, y: 48.9 },
    { x: 80, y: 65.0 },
    { x: 90, y: 72.3 },
    { x: 100, y: 85.1 }
  ]);
  const [newX, setNewX] = useState('');
  const [newY, setNewY] = useState('');
  const [chartType, setChartType] = useState<'scatter' | 'histogram' | 'boxplot' | 'bar' | 'line'>('scatter');
  const [binCount, setBinCount] = useState<number>(5);
  const [rawInputText, setRawInputText] = useState('');
  const [hoveredBoxMetric, setHoveredBoxMetric] = useState<'min' | 'q1' | 'median' | 'q3' | 'max' | 'mean' | null>(null);
  const [showTrendLine, setShowTrendLine] = useState(true);

  // --- ANOMALY & OUTLIER DETECTION STATE ---
  const [anomalyAlgorithm, setAnomalyAlgorithm] = useState<'iqr' | 'zscore' | 'mad'>('iqr');
  const [iqrFactor, setIqrFactor] = useState<number>(1.5);
  const [zScoreThreshold, setZScoreThreshold] = useState<number>(2.0);
  const [madThreshold, setMadThreshold] = useState<number>(3.5);
  const [anomalyDisplayMode, setAnomalyDisplayMode] = useState<'highlight' | 'filterOut' | 'normal'>('highlight');

  // --- PLANETARY GRAVITY MAP ---
  const PLANET_GRAVITY_MAP: Record<string, { gravity: number; description: string }> = {
    mercury: { gravity: 3.70, description: "Low atmospheric drag, hyper-floaty drop characteristics." },
    venus: { gravity: 8.87, description: "Thick carbon atmosphere, strong crushing pressure." },
    earth: { gravity: 9.81, description: "Standard terrestrial reference gravity of 1.0g." },
    mars: { gravity: 3.71, description: "Weak Martian core, graceful low-gravity descent." },
    jupiter: { gravity: 24.79, description: "Enormous crushing gravitational pull. Locomotion is near-impossible." },
    saturn: { gravity: 10.44, description: "Dense gas giant with a slight boost over Earth gravity." },
    uranus: { gravity: 8.69, description: "Ice giant core, moderate orbital pull." },
    neptune: { gravity: 11.15, description: "Highest gravity of the ice giants, heavy core pull." }
  };

  // --- PLANETARY PHYSICS DROPPING LOOP ---
  useEffect(() => {
    if (!isDropping || !selectedPlanet) return;
    
    const planetId = selectedPlanet.id;
    const g = PLANET_GRAVITY_MAP[planetId]?.gravity || 9.81;
    const distance = 10; // 10 meters drop
    const totalTime = Math.sqrt((2 * distance) / g); // t = sqrt(2d/g)
    
    let startTimestamp: number | null = null;
    let animationId: number;
    
    const tick = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsedMs = timestamp - startTimestamp;
      const elapsedSec = elapsedMs / 1000;
      
      if (elapsedSec >= totalTime) {
        setSimY(1);
        setSimTime(totalTime);
        setIsDropping(false);
        addAuditLog(`Planetary Gravity Simulator: ${selectedDropObject} impacted grid on ${selectedPlanet.name} in ${totalTime.toFixed(3)}s.`, 'SUCCESS');
      } else {
        const currentY = (0.5 * g * elapsedSec * elapsedSec) / distance;
        setSimY(Math.min(currentY, 1));
        setSimTime(elapsedSec);
        animationId = requestAnimationFrame(tick);
      }
    };
    
    animationId = requestAnimationFrame(tick);
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isDropping, selectedPlanet, selectedDropObject]);

  const triggerDrop = () => {
    setSimY(0);
    setSimTime(0);
    setIsDropping(true);
  };

  // Load NASA APOD and USGS earthquakes immediately!
  useEffect(() => {
    fetchNasaApod();
    fetchSeismicFeed();
  }, []);

  // Fetch News automatically when category shifts
  useEffect(() => {
    fetchNews(newsCategory);
  }, [newsCategory]);

  // --- SCIENTECH & NASA NEWS FEED ---
  const fetchNews = async (category: 'nasa' | 'tech') => {
    setNewsLoading(true);
    setNewsError(null);
    try {
      const res = await fetch(`/api/news?category=${category}`);
      if (!res.ok) throw new Error(`Gateway status error (${res.status})`);
      const data = await res.json();
      setNewsArticles(data.articles || []);
      setNewsSource(data.source || 'Unified Satellite Network');
    } catch (err: any) {
      console.warn("News feed failed:", err.message);
      setNewsError("Gateway experiencing network loads. Displaying curated backup telemetry feeds.");
    } finally {
      setNewsLoading(false);
    }
  };

  // --- NASA APOD CALL ---
  const fetchNasaApod = async () => {
    setApodLoading(true);
    setApodError(null);
    try {
      const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKeyNasa}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`NASA Gateway returned error Status code (${res.status})`);
      }
      const json = await res.json();
      setApodData(json);
      addAuditLog(`NASA APOD Astronomy Picture Loaded: "${json.title}"`, 'SUCCESS');
    } catch (err: any) {
      console.warn("NASA APOD API error. Triggering offline mock fallback.", err.message);
      setApodError(`NASA core offline. Rendering simulated APOD data.`);
      // Seeding backup APOD details
      setApodData({
        url: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&w=1200&q=80',
        title: 'Deep Cosmological Constellation Field',
        explanation: 'NASA fallback rendering: The Carina Nebula (NGC 3372) is a dynamic stellar nursery where colossal stars ignite cloud fragments of dust and gas creating highly volatile hydrogen formations.',
        copyright: 'Simulated NASA APOD Sensor Feed'
      });
      addAuditLog(`Triggered offline backup APOD generator.`, 'WARNING');
    } finally {
      setApodLoading(false);
    }
  };

  // --- USGS LIVE EARTHQUAKES ---
  const fetchSeismicFeed = async () => {
    setSeismicLoading(true);
    try {
      const url = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("USGS server unresponsive");
      const json = await res.json();
      
      // Filter out top 12 earthquakes on magnitude
      const parsed: EarthquakeItem[] = json.features
        .slice(0, 40)
        .map((f: any) => ({
          id: f.id,
          place: f.properties.place,
          magnitude: parseFloat(f.properties.mag),
          time: new Date(f.properties.time).toLocaleTimeString(),
          depth: parseFloat(f.geometry.coordinates[2]),
          tsunami: f.properties.tsunami === 1,
          url: f.properties.url
        }))
        .filter((item: EarthquakeItem) => !isNaN(item.magnitude))
        .sort((a: any, b: any) => b.magnitude - a.magnitude)
        .slice(0, 12);

      setSeismicData(parsed);
      addAuditLog(`Seismic USGS Earthquakes Feed connected: ${parsed.length} incidents logged`, 'SUCCESS');
    } catch (err: any) {
      console.warn("Failed retrieving USGS earthquake feed. Activating offline simulation.", err.message);
      // Mock seismic events
      setSeismicData([
        { id: 'm-1', place: '12km E of Honshu, Japan', magnitude: 6.1, time: '21:12:00', depth: 32.5, tsunami: true, url: '#' },
        { id: 'm-2', place: 'Californian Fault Line Core', magnitude: 4.8, time: '18:45:10', depth: 8.2, tsunami: false, url: '#' },
        { id: 'm-3', place: 'Reykjanes Ridge, Iceland', magnitude: 5.4, time: '14:20:15', depth: 10.0, tsunami: false, url: '#' },
        { id: 'm-4', place: 'Hindu Kush Region, Afghanistan', magnitude: 4.2, time: '11:05:40', depth: 180.4, tsunami: false, url: '#' }
      ]);
      addAuditLog(`Loaded simulated USGS seismic data instead`, 'WARNING');
    } finally {
      setSeismicLoading(false);
    }
  };

  // --- STATS DATA PRESETS & CALCS ---
  const STATS_PRESETS = [
    {
      name: "Decadal Temperature anomalies",
      desc: "Anomalies in global deviations (°C) over the 20th century average.",
      data: [
        { x: 1930, y: -0.15 },
        { x: 1940, y: -0.08 },
        { x: 1950, y: -0.11 },
        { x: 1960, y: 0.02 },
        { x: 1970, y: 0.08 },
        { x: 1980, y: 0.24 },
        { x: 1990, y: 0.38 },
        { x: 2000, y: 0.40 },
        { x: 2010, y: 0.65 },
        { x: 2020, y: 0.98 },
        { x: 2030, y: 1.12 },
        { x: 2040, y: 1.35 }
      ]
    },
    {
      name: "Quantum Photon decay rates",
      desc: "Raw density of decay intervals tracked in magnetic trap setups.",
      data: [
        { x: 1, y: 42.5 },
        { x: 2, y: 55.4 },
        { x: 3, y: 31.0 },
        { x: 4, y: 18.9 },
        { x: 5, y: 62.0 },
        { x: 6, y: 88.6 },
        { x: 7, y: 95.1 },
        { x: 8, y: 72.3 },
        { x: 9, y: 115.0 },
        { x: 10, y: 124.2 },
        { x: 11, y: 104.5 },
        { x: 12, y: 82.0 },
        { x: 13, y: 145.2 },
        { x: 14, y: 11.2 }
      ]
    },
    {
      name: "Enzyme concentration spreads",
      desc: "Continuous reactant density sweeps (mol/L) across cell cultures.",
      data: [
        { x: 5, y: 12.0 },
        { x: 10, y: 16.5 },
        { x: 15, y: 22.8 },
        { x: 20, y: 25.1 },
        { x: 25, y: 35.0 },
        { x: 30, y: 41.2 },
        { x: 35, y: 45.6 },
        { x: 40, y: 42.0 },
        { x: 45, y: 38.4 },
        { x: 50, y: 29.5 },
        { x: 55, y: 18.1 },
        { x: 60, y: 10.4 }
      ]
    }
  ];

  const handleAddStatsPoint = (e: React.FormEvent) => {
    e.preventDefault();
    const valX = parseFloat(newX);
    const valY = parseFloat(newY);
    if (isNaN(valX) || isNaN(valY)) {
      alert("Please provide proper numeric coordinate scales!");
      return;
    }
    setStatsPairs(prev => [...prev, { x: valX, y: valY }].sort((a,b) => a.x - b.x));
    setNewX('');
    setNewY('');
    addAuditLog(`Added custom data vector coordinate: [${valX}, ${valY}]`, 'SUCCESS');
  };

  const handleBatchParse = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = rawInputText
      .split(/[\s,;]+/)
      .map(v => parseFloat(v))
      .filter(v => !isNaN(v));

    if (parsed.length === 0) {
      alert("No valid statistical quantities extracted. Use comma or spaces to divide parameters.");
      return;
    }

    const nextPairs = parsed.map((val, idx) => ({
      x: (idx + 1) * 10,
      y: val
    }));

    setStatsPairs(nextPairs);
    setRawInputText('');
    addAuditLog(`Batch processed ${parsed.length} data metrics into active sample array`, 'SUCCESS');
  };

  const clearStatsPoints = () => {
    setStatsPairs([]);
    addAuditLog(`Custom stats pairs array cleared`, 'WARNING');
  };

  const getRegressionLine = (dataToUse = statsPairs) => {
    if (dataToUse.length < 2) return null;
    const n = dataToUse.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumXX = 0;
    let sumYY = 0;

    dataToUse.forEach(p => {
      sumX += p.x;
      sumY += p.y;
      sumXY += p.x * p.y;
      sumXX += p.x * p.x;
      sumYY += p.y * p.y;
    });

    const num = n * sumXY - sumX * sumY;
    const den = n * sumXX - sumX * sumX;
    if (den === 0) return null;

    const slope = num / den;
    const intercept = (sumY - slope * sumX) / n;

    const meanY = sumY / n;
    let ssTot = 0;
    let ssRes = 0;
    dataToUse.forEach(p => {
      const predY = slope * p.x + intercept;
      ssTot += Math.pow(p.y - meanY, 2);
      ssRes += Math.pow(p.y - predY, 2);
    });

    const rSquared = ssTot === 0 ? 1 : 1 - (ssRes / ssTot);
    const minX = Math.min(...dataToUse.map(p => p.x));
    const maxX = Math.max(...dataToUse.map(p => p.x));

    return {
      slope,
      intercept,
      rSquared,
      points: [
        { x: minX, y: slope * minX + intercept },
        { x: maxX, y: slope * maxX + intercept }
      ]
    };
  };

  const getFiveNumberSummary = (dataToUse = statsPairs) => {
    if (dataToUse.length === 0) return null;
    const sortedY = dataToUse.map(p => p.y).sort((a, b) => a - b);
    const n = sortedY.length;
    const min = sortedY[0];
    const max = sortedY[n - 1];

    const getMedian = (arr: number[]) => {
      const len = arr.length;
      if (len === 0) return 0;
      const mid = Math.floor(len / 2);
      return len % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
    };

    const median = getMedian(sortedY);

    const midIndex = Math.floor(n / 2);
    const lowerHalf = sortedY.slice(0, midIndex);
    const upperHalf = n % 2 === 0 ? sortedY.slice(midIndex) : sortedY.slice(midIndex + 1);

    const q1 = getMedian(lowerHalf);
    const q3 = getMedian(upperHalf);
    const iqr = q3 - qcQuartileOneWorkaround(q1); // simple safeguard
    
    function qcQuartileOneWorkaround(val: number) { return val; }

    const mean = sortedY.reduce((sum, v) => sum + v, 0) / n;
    const variance = sortedY.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);

    const lowerFence = q1 - 1.5 * iqr;
    const upperFence = q3 + 1.5 * iqr;
    const outliers = sortedY.filter(v => v < lowerFence || v > upperFence);

    return {
      min,
      q1,
      median,
      q3,
      max,
      iqr,
      mean,
      variance,
      stdDev,
      outliers,
      lowerFence,
      upperFence,
      sortedY
    };
  };

  const getHistogramData = (dataToUse = statsPairs) => {
    if (dataToUse.length === 0) return [];
    const sortedY = dataToUse.map(p => p.y).sort((a, b) => a - b);
    const minY = sortedY[0];
    const maxY = sortedY[sortedY.length - 1];
    const range = maxY - minY;

    if (range === 0) {
      return [{
        binLabel: `${minY.toFixed(1)}`,
        frequency: dataToUse.length,
        binStart: minY,
        binEnd: minY
      }];
    }

    const binWidth = range / binCount;
    const bins = Array.from({ length: binCount }).map((_, idx) => {
      const start = minY + idx * binWidth;
      const end = start + binWidth;
      return {
        binStart: start,
        binEnd: end,
        binLabel: `[${start.toFixed(1)}, ${end.toFixed(1)}${idx === binCount - 1 ? ']' : ')'}`,
        frequency: 0
      };
    });

    dataToUse.forEach(p => {
      const val = p.y;
      let binIdx = Math.floor((val - minY) / binWidth);
      if (binIdx >= binCount) {
        binIdx = binCount - 1;
      }
      if (binIdx < 0) {
        binIdx = 0;
      }
      bins[binIdx].frequency++;
    });

    return bins;
  };

  const getAnomalyDetails = (dataToUse = statsPairs) => {
    if (dataToUse.length === 0) {
      return {
        pointsWithStatus: [],
        anomalies: [],
        normal: [],
        iqrDetails: { lowerFence: 0, upperFence: 0, iqr: 0, q1: 0, q3: 0, median: 0 },
        zScoreDetails: { mean: 0, stdDev: 1 },
        madDetails: { median: 0, mad: 1 }
      };
    }
    const n = dataToUse.length;
    const yValues = dataToUse.map(p => p.y);

    // 1. IQR Calculations
    const sortedY = [...yValues].sort((a, b) => a - b);
    const getMedian = (arr: number[]) => {
      const len = arr.length;
      if (len === 0) return 0;
      const mid = Math.floor(len / 2);
      return len % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;
    };
    const medVal = getMedian(sortedY);
    const midIndex = Math.floor(sortedY.length / 2);
    const lowerHalf = sortedY.slice(0, midIndex);
    const upperHalf = sortedY.length % 2 === 0 ? sortedY.slice(midIndex) : sortedY.slice(midIndex + 1);
    const q1Val = getMedian(lowerHalf);
    const q3Val = getMedian(upperHalf);
    const iqrVal = q3Val - q1Val;
    const iqrLowerFence = q1Val - iqrFactor * iqrVal;
    const iqrUpperFence = q3Val + iqrFactor * iqrVal;

    // 2. Z-Score Calculations
    const meanVal = yValues.reduce((sum, v) => sum + v, 0) / n;
    const varianceVal = yValues.reduce((sum, v) => sum + Math.pow(v - meanVal, 2), 0) / n;
    const stdDevVal = Math.sqrt(varianceVal) || 1e-5;

    // 3. MAD (Modified Z-Score) Calculations
    const absoluteDeviations = yValues.map(v => Math.abs(v - medVal));
    const sortedDevs = [...absoluteDeviations].sort((a, b) => a - b);
    const madVal = getMedian(sortedDevs) || 1e-5;

    const pointsWithStatus = dataToUse.map((p, idx) => {
      let isAnomaly = false;
      let scoreLabel = "";
      let scoreValue = 0;

      if (anomalyAlgorithm === 'iqr') {
        const outLower = p.y < iqrLowerFence;
        const outUpper = p.y > iqrUpperFence;
        isAnomaly = outLower || outUpper;
        scoreLabel = outLower ? "Below Lower Fence" : outUpper ? "Above Upper Fence" : "In Range (IQR)";
        scoreValue = p.y;
      } else if (anomalyAlgorithm === 'zscore') {
        const zScore = (p.y - meanVal) / stdDevVal;
        isAnomaly = Math.abs(zScore) > zScoreThreshold;
        scoreLabel = `Z-Score: ${zScore.toFixed(2)}`;
        scoreValue = zScore;
      } else if (anomalyAlgorithm === 'mad') {
        const modZ = (0.6745 * (p.y - medVal)) / madVal;
        isAnomaly = Math.abs(modZ) > madThreshold;
        scoreLabel = `Mod Z: ${modZ.toFixed(2)}`;
        scoreValue = modZ;
      }

      return {
        x: p.x,
        y: p.y,
        index: idx + 1,
        isAnomaly,
        scoreLabel,
        scoreValue
      };
    });

    const anomalies = pointsWithStatus.filter(p => p.isAnomaly);
    const normal = pointsWithStatus.filter(p => !p.isAnomaly);

    return {
      pointsWithStatus,
      anomalies,
      normal,
      iqrDetails: {
        lowerFence: iqrLowerFence,
        upperFence: iqrUpperFence,
        iqr: iqrVal,
        q1: q1Val,
        q3: q3Val,
        median: medVal,
      },
      zScoreDetails: {
        mean: meanVal,
        stdDev: stdDevVal,
      },
      madDetails: {
        median: medVal,
        mad: madVal,
      }
    };
  };

  const handleDeleteStatsPoint = (indexToDelete: number) => {
    if (indexToDelete < 0 || indexToDelete >= statsPairs.length) return;
    const targetPoint = statsPairs[indexToDelete];
    setStatsPairs(prev => prev.filter((_, idx) => idx !== indexToDelete));
    addAuditLog(`Scrubbed coordinates target X: ${targetPoint.x} • Y: ${targetPoint.y} from core dataset`, 'WARNING');
  };

  const exportStatsDetails = () => {
    const jsonStr = JSON.stringify(statsPairs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prismation_vector_dataset_${Date.now()}.json`;
    a.click();
    addAuditLog(`Exported statistical telemetry JSON successfully`, 'SUCCESS');
  };

  const exportChartAsImage = async (format: 'png' | 'svg' = 'png') => {
    try {
      const container = document.getElementById('telemetry-chart-container');
      if (!container) {
        alert("Active plot visualization container not found.");
        return;
      }
      const svgElement = container.querySelector('svg');
      if (!svgElement) {
        alert("Active vector SVG tree element not found in display workspace.");
        return;
      }

      const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
      const width = svgElement.clientWidth || 750;
      const height = svgElement.clientHeight || 380;
      clonedSvg.setAttribute('width', width.toString());
      clonedSvg.setAttribute('height', height.toString());
      
      clonedSvg.setAttribute('style', `background-color: #030712; padding: 12px; border-radius: 12px; font-family: ui-sans-serif, system-ui, sans-serif; color: #f3f4f6;`);

      const serializer = new XMLSerializer();
      let svgString = serializer.serializeToString(clonedSvg);
      
      if (format === 'svg') {
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const link = document.createElement('a');
        link.href = svgUrl;
        link.download = `prismation_telemetry_vector_${Date.now()}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        addAuditLog(`Exported active statistical visualization matrix as Vector SVG`, 'SUCCESS');
      } else {
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const imageEncoder = new Image();
        
        imageEncoder.onload = () => {
          const canvasEncoder = document.createElement('canvas');
          canvasEncoder.width = width * 2;
          canvasEncoder.height = height * 2;
          const ctxEncoder = canvasEncoder.getContext('2d');
          
          if (ctxEncoder) {
            ctxEncoder.scale(2, 2);
            ctxEncoder.fillStyle = '#030712';
            ctxEncoder.fillRect(0, 0, width, height);
            ctxEncoder.drawImage(imageEncoder, 0, 0, width, height);
            
            try {
              const pngDataUrl = canvasEncoder.toDataURL('image/png');
              const link = document.createElement('a');
              link.href = pngDataUrl;
              link.download = `prismation_telemetry_raster_${Date.now()}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              addAuditLog(`Exported active statistical visualization matrix as High-Res PNG`, 'SUCCESS');
            } catch (err) {
              console.error("Canvas raster export failed", err);
              const fallback = document.createElement('a');
              fallback.href = svgUrl;
              fallback.download = `prismation_telemetry_fallback_${Date.now()}.svg`;
              fallback.click();
            }
          }
          URL.revokeObjectURL(svgUrl);
        };
        imageEncoder.src = svgUrl;
      }
    } catch (e: any) {
      console.error("Image generation calculations failed", e);
      alert(`Mathematical visual exporter failed: ${e.message}`);
    }
  };

  const getPlanetVisualClass = (planetId: string) => {
    switch (planetId) {
      case 'mercury': return 'from-amber-700 via-stone-600 to-amber-950 animate-pulse';
      case 'venus': return 'from-orange-400 via-amber-500 to-yellow-600';
      case 'earth': return 'from-emerald-500 via-sky-500 to-blue-700';
      case 'mars': return 'from-red-600 via-rose-500 to-orange-800 animate-pulse';
      case 'jupiter': return 'from-amber-600 via-orange-400 to-amber-900';
      case 'saturn': return 'from-yellow-600 via-amber-400 to-slate-700';
      case 'uranus': return 'from-cyan-400 via-teal-500 to-blue-600';
      default: return 'from-blue-500 via-blue-600 to-indigo-900';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. SECTION TABS DIRECTORY */}
      <div className="flex bg-slate-950/40 border border-white/5 p-1 rounded-xl w-full max-w-lg mx-auto md:mx-0">
        {(['astro', 'biochem', 'eon', 'stats'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-1.5 text-[11px] font-medium rounded-lg transition uppercase tracking-wide cursor-pointer ${
              activeTab === tab
                ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/40'
            }`}
          >
            {tab === 'astro' ? 'Astrophysics' : tab === 'biochem' ? 'Bio-Chem Lab' : tab === 'eon' ? 'Earth Eons' : 'Telemetry Stats'}
          </button>
        ))}
      </div>

      {/* 2. ASTROPHYSICS TAB PANEL */}
      {activeTab === 'astro' && (
        <div className="space-y-6">
          {/* NASA APOD Section */}
          <div className="glass-panel rounded-2xl p-6 text-left">
            <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest mb-4 flex items-center space-x-2">
              <Orbit className="w-4 h-4 text-violet-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>NASA Deep Space Imagery Portal (APOD API)</span>
            </h4>

            {apodLoading ? (
              <div className="p-12 text-center">
                <RefreshCw className="w-8 h-8 animate-spin text-violet-400 mx-auto mb-2" />
                <span className="text-xs font-mono text-slate-400">Querying NASA Deep Space Satellite network...</span>
              </div>
            ) : apodData ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  <div 
                    onClick={() => setIsApodModalOpen(true)}
                    className="lg:col-span-2 overflow-hidden rounded-xl border border-white/10 group relative max-h-72 cursor-pointer transition shadow-lg hover:shadow-violet-500/10 hover:border-violet-500/30"
                    title="Click to view full-screen astronomy picture"
                  >
                    <img
                      src={apodData.url}
                      alt={apodData.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                      <span className="self-end bg-violet-600/80 backdrop-blur text-[8px] font-mono font-bold tracking-wider px-2 py-0.5 rounded uppercase text-white">Click to Zoom</span>
                      <p className="text-[10px] text-slate-300 font-mono">Copyright: {apodData.copyright || 'NASA Public Domain'}</p>
                    </div>
                  </div>
                  <div className="lg:col-span-3 flex flex-col justify-between text-left">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="text-sm font-bold text-white font-display">{apodData.title}</h5>
                        {apodData.date && (
                          <span className="text-[9px] font-mono text-slate-400 bg-slate-900 border border-white/5 py-0.5 px-2 rounded">{apodData.date}</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed font-sans">{apodData.explanation}</p>
                      <button
                        onClick={() => setIsApodModalOpen(true)}
                        className="mt-3.5 bg-violet-600 hover:bg-violet-700 text-white font-mono text-[10px] font-bold px-3 py-1.5 rounded-lg flex items-center space-x-1 cursor-pointer transition"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>View Immersive HD Model</span>
                      </button>
                    </div>
                    {apodError && (
                      <span className="text-[10px] font-mono text-amber-500 block mt-2 bg-amber-500/5 p-2 rounded border border-amber-500/20">
                        ⚠️ {apodError}
                      </span>
                    )}
                  </div>
                </div>

                {/* NASA APOD IMAGE EXPANSION PORTAL MODAL */}
                {isApodModalOpen && (
                  <div className="fixed inset-0 min-h-screen z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
                    <div 
                      className="absolute inset-0 cursor-zoom-out" 
                      onClick={() => setIsApodModalOpen(false)} 
                    />
                    <div className="bg-slate-950 border border-white/10 rounded-2xl max-w-5xl w-full overflow-hidden shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-200 text-left">
                      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-slate-900/60 font-display">
                        <div>
                          <span className="text-[9px] font-mono text-violet-400 uppercase tracking-widest block font-bold">NASA Daily Explorer Portal</span>
                          <h3 className="text-sm font-bold text-white leading-tight">{apodData.title}</h3>
                        </div>
                        <button
                          onClick={() => setIsApodModalOpen(false)}
                          className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full transition cursor-pointer font-bold font-mono text-xs w-7 h-7 flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 max-h-[80vh] overflow-y-auto">
                        <div className="lg:col-span-8 bg-slate-950 flex items-center justify-center p-4 min-h-[320px] lg:h-[65vh]">
                          <img
                            src={apodData.hdurl || apodData.url}
                            alt={apodData.title}
                            className="max-w-full max-h-full object-contain rounded-lg border border-white/5 shadow-xl"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <div className="lg:col-span-4 bg-slate-900/40 border-t lg:border-t-0 lg:border-l border-white/5 p-6 flex flex-col justify-between overflow-y-auto lg:h-[65vh]">
                          <div className="space-y-4">
                            <div>
                              <span className="text-[10px] font-mono text-slate-500 uppercase block">Cosmological Title</span>
                              <h4 className="text-sm font-bold text-white font-display">{apodData.title}</h4>
                            </div>

                            <div>
                              <span className="text-[10px] font-mono text-slate-500 uppercase block">Scientific Capture Date</span>
                              <span className="text-xs text-slate-300 font-mono">{apodData.date || 'Today'}</span>
                            </div>

                            <div>
                              <span className="text-[10px] font-mono text-slate-500 uppercase block">Explanatory Analysis</span>
                              <p className="text-xs text-slate-400 leading-relaxed font-sans">{apodData.explanation}</p>
                            </div>
                          </div>

                          <div className="mt-6 pt-4 border-t border-white/5 space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-mono">
                              <span className="text-slate-500">Copyright Sensor</span>
                              <span className="text-slate-300 truncate max-w-[180px]">{apodData.copyright || 'NASA Public Domain'}</span>
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-mono">
                              <span className="text-slate-500">Gateway Pipeline</span>
                              <span className="text-emerald-400 font-bold">STABLE HTTPS</span>
                            </div>
                            <a
                              href={apodData.hdurl || apodData.url}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-3 w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-center font-mono py-2 rounded-lg text-[10px] font-bold tracking-wide transition block cursor-pointer border border-white/5"
                            >
                              🔗 OPEN RAW HD FILE
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-xs text-slate-400">APOD Telemetry failed to synthesize.</p>
            )}
          </div>

          {/* NASA & TECHNOLOGY NEWS CHRONICLE CENTRE */}
          <div className="glass-panel rounded-2xl p-6 text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-white/5">
              <div>
                <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-pink-500 animate-pulse" />
                  <span>Geopolitics & Quantum Tech Chronicles</span>
                </h4>
                <p className="text-[10px] text-slate-500 font-mono mt-1">
                  Active gateway synchronized directly with {newsSource || "NASA/HN Feeds"}
                </p>
              </div>

              {/* NEWS SUB-TABS */}
              <div className="flex space-x-2 bg-slate-950 p-1 rounded-xl border border-white/5 shrink-0 self-start md:self-auto">
                <button
                  onClick={() => setNewsCategory('nasa')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition cursor-pointer ${
                    newsCategory === 'nasa'
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Newspaper className="w-3.5 h-3.5" />
                  <span>NASA Headlines</span>
                </button>
                <button
                  onClick={() => setNewsCategory('tech')}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase transition cursor-pointer ${
                    newsCategory === 'tech'
                      ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>Technology Logs</span>
                </button>
              </div>
            </div>

            {/* ERROR FLAG */}
            {newsError && (
              <div className="mb-4 bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs p-3 rounded-xl flex items-center space-x-2.5 font-sans">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{newsError}</span>
              </div>
            )}

            {/* LOADER */}
            {newsLoading ? (
              <div className="p-16 text-center">
                <RefreshCw className="w-7 h-7 animate-spin text-pink-500 mx-auto mb-2" />
                <span className="text-xs font-mono text-slate-400 block mt-1">Establishing quantum teleportation handshake...</span>
              </div>
            ) : newsArticles && newsArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsArticles.map((article: any, index: number) => (
                  <div 
                    key={article.id || index}
                    className="group border border-white/5 bg-slate-950/40 rounded-xl overflow-hidden hover:border-violet-500/30 transition-all duration-300 flex flex-col justify-between hover:shadow-lg hover:shadow-violet-600/5 hover:-translate-y-0.5"
                  >
                    <div>
                      {/* Optional article illustration */}
                      <div className="h-40 w-full relative overflow-hidden bg-slate-900 border-b border-white/5">
                        <img 
                          src={article.imageUrl} 
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2.5 left-2.5 bg-slate-950/85 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded text-[8px] font-mono tracking-wider text-slate-300 uppercase">
                          {article.source}
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <span className="text-[9px] font-mono text-slate-500 block">{article.publishedAt}</span>
                        <h5 className="text-xs font-bold text-slate-100 group-hover:text-white transition leading-snug line-clamp-2">
                          {article.title}
                        </h5>
                        <p className="text-[11px] text-slate-400 leading-relaxed font-sans line-clamp-3">
                          {article.summary}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-1 border-t border-white/5 bg-slate-950/40">
                      <a 
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-full items-center justify-center space-x-1 border border-white/5 hover:border-pink-500/30 hover:bg-pink-500/5 bg-slate-900 text-slate-200 hover:text-white text-[10px] font-mono font-bold py-1.5 rounded-lg transition active:scale-95"
                      >
                        <span>Inspect Full Analysis Log</span>
                        <span>&rarr;</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-6 text-center">No telemetry chronicles detected on this wave.</p>
            )}
          </div>

          {/* Interactive Solar System Planet Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 glass-panel rounded-2xl p-6 text-left">
              <h4 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-widest mb-4">
                Planet Core Telemetry (Expand details)
              </h4>
              <p className="text-xs text-slate-400 mb-4 bg-slate-950/20 p-2.5 rounded-lg border border-white/5">
                Click any planetary node from the table to inject gravitational coordinates and inspect raw structural compositions.
              </p>
              <div className="grid grid-cols-4 gap-2.5">
                {PLANETS.map((planet) => (
                  <button
                    key={planet.id}
                    onClick={() => setSelectedPlanet(planet)}
                    className={`p-2.5 rounded-lg border text-xs font-bold uppercase transition flex flex-col items-center justify-center cursor-pointer ${
                      selectedPlanet?.id === planet.id
                        ? 'bg-violet-600/30 border-violet-500 text-white shadow-md glow-primary'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-[10px] font-mono">{planet.name.substring(0, 3)}</span>
                  </button>
                ))}
              </div>

              {selectedPlanet && (
                <div className="mt-6 p-4 rounded-xl border border-white/5 bg-slate-950/40 space-y-3.5">
                  <div className="flex items-center space-x-3.5">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r shadow-lg ${getPlanetVisualClass(selectedPlanet.id)}`} />
                    <div>
                      <h5 className="text-xs font-bold text-white font-display uppercase tracking-wider">{selectedPlanet.name}</h5>
                      <span className="text-[9px] font-mono text-violet-400 uppercase tracking-widest">{selectedPlanet.type}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400">
                    <div className="p-2 border border-slate-800 bg-black/20 rounded">
                      <span>Orbit Radius:</span>
                      <strong className="block text-slate-200 mt-0.5">{selectedPlanet.distanceFromSun}</strong>
                    </div>
                    <div className="p-2 border border-slate-800 bg-black/20 rounded">
                      <span>Core Diameter:</span>
                      <strong className="block text-slate-200 mt-0.5">{selectedPlanet.diameter}</strong>
                    </div>
                    <div className="p-2 border border-slate-800 bg-black/20 rounded">
                      <span>Thermal Scope:</span>
                      <strong className="block text-slate-200 mt-0.5">{selectedPlanet.tempRange}</strong>
                    </div>
                    <div className="p-2 border border-slate-800 bg-black/20 rounded">
                      <span>Satellites (Moons):</span>
                      <strong className="block text-slate-200 mt-0.5">{selectedPlanet.moons} Moons</strong>
                    </div>
                  </div>

                  <p className="text-[11px] italic font-sans border-t border-white/5 pt-2.5 text-slate-300">
                    "{selectedPlanet.funFact}"
                  </p>
                </div>
              )}

              {selectedPlanet && (
                <div className="mt-4 glass-panel rounded-2xl p-5 text-left border border-white/5 bg-slate-900/10 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-widest flex items-center justify-between">
                      <span>Gravity Drop Lab (10m)</span>
                      <span className="text-[9px] text-violet-400 font-normal lowercase">{selectedPlanet.name} local physics</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1">
                      Test kinetic dropping dynamics utilizing {selectedPlanet.name}'s active core mass.
                    </p>
                  </div>

                  {/* Object Selectors */}
                  <div className="grid grid-cols-3 gap-1.5 bg-slate-950/40 p-1 border border-slate-900 rounded-lg">
                    {(['apple', 'astronaut', 'satellite'] as const).map((obj) => (
                      <button
                        key={obj}
                        disabled={isDropping}
                        onClick={() => {
                          setSelectedDropObject(obj);
                          setSimY(0);
                          setSimTime(0);
                        }}
                        className={`py-1 rounded text-[10px] font-mono transition capitalize flex flex-col items-center justify-center cursor-pointer ${
                          selectedDropObject === obj
                            ? 'bg-violet-600/30 text-white font-semibold border-t border-violet-500/50'
                            : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span className="text-sm">
                          {obj === 'apple' ? '🍎' : obj === 'astronaut' ? '👨‍🚀' : '🛰️'}
                        </span>
                        <span className="scale-90 text-[8px]">{obj}</span>
                      </button>
                    ))}
                  </div>

                  {/* Drop Track SVG Tracker */}
                  <div className="relative h-28 bg-slate-950/40 border border-slate-900/60 rounded-xl overflow-hidden flex items-center justify-between p-3">
                    {/* Position indicators */}
                    <div className="absolute left-2.5 top-2.5 bottom-2.5 flex flex-col justify-between font-mono text-[7px] text-slate-600 select-none border-r border-slate-800/40 pr-1.5">
                      <span>10m</span>
                      <span>5m</span>
                      <span>0m</span>
                    </div>

                    {/* Dropping Object visual node */}
                    <div 
                      className="absolute transition-transform duration-75 text-lg"
                      style={{ 
                        left: '32px',
                        top: `calc(10% + ${simY * 72}%)`, 
                        transform: `translateY(-50%) ${simY === 1 ? 'rotate(12deg) scale(0.95)' : ''}`,
                      }}
                    >
                      {selectedDropObject === 'apple' ? '🍎' : selectedDropObject === 'astronaut' ? '👨‍🚀' : '🛰️'}
                    </div>

                    {/* Live Telemetry readouts */}
                    <div className="flex-1 pl-14 space-y-0.5 text-right font-mono text-[9px]">
                      <div className="text-[7.5px] text-slate-500 uppercase tracking-wider mb-1.5">Simulation Readout</div>
                      <div className="flex justify-between border-b border-white/5 pb-0.5">
                        <span className="text-slate-500">Time:</span>
                        <span className="text-slate-200 font-bold">{simTime.toFixed(3)} s</span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-0.5">
                        <span className="text-slate-500">Velocity:</span>
                        <span className="text-slate-200 font-bold">
                          {((PLANET_GRAVITY_MAP[selectedPlanet.id]?.gravity || 9.81) * simTime).toFixed(1)} m/s
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-white/5 pb-0.5">
                        <span className="text-slate-500">Position:</span>
                        <span className="text-slate-200 font-bold">{(10 - (simY * 10)).toFixed(1)} m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">G-Force:</span>
                        <span className="text-violet-400 font-bold">
                          {((PLANET_GRAVITY_MAP[selectedPlanet.id]?.gravity || 9.81) / 9.81).toFixed(2)} g
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={triggerDrop}
                      disabled={isDropping}
                      className="flex-1 py-1.5 rounded-lg text-[10px] font-mono tracking-wider uppercase font-bold text-white bg-violet-600 hover:bg-violet-500 transition cursor-pointer disabled:opacity-50"
                    >
                      {isDropping ? 'Simulating...' : 'Drop Test'}
                    </button>
                    <button
                      onClick={() => {
                        setSimY(0);
                        setSimTime(0);
                        setIsDropping(false);
                      }}
                      className="px-3 py-1.5 rounded-lg text-[10px] font-mono border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-white/5 transition cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>

                  {/* Weight Converter */}
                  <div className="space-y-1.5 pt-2.5 border-t border-white/5">
                    <div className="flex justify-between items-center bg-slate-950/20 p-1.5 rounded-lg border border-slate-900/60">
                      <span className="text-[8px] font-mono text-slate-400 uppercase">Earth Mass: {earthWeightInput} kg</span>
                      <input 
                        type="range" 
                        min="30" 
                        max="150" 
                        value={earthWeightInput} 
                        onChange={(e) => setEarthWeightInput(Number(e.target.value))}
                        className="w-24 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-violet-500" 
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 font-sans leading-normal">
                      With a local acceleration of <span className="text-violet-400 font-bold font-mono">{(PLANET_GRAVITY_MAP[selectedPlanet.id]?.gravity || 9.81).toFixed(2)} m/s²</span>, a {earthWeightInput} kg explorer weighs <span className="text-violet-400 font-bold font-mono">{((earthWeightInput * (PLANET_GRAVITY_MAP[selectedPlanet.id]?.gravity || 9.81)) / 9.81).toFixed(1)} kg</span> on <span className="text-white font-semibold">{selectedPlanet.name}</span>.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Cosmic interactive timeline */}
            <div className="md:col-span-2 glass-panel rounded-2xl p-6 text-left">
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2.5">
                <h4 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-widest">
                  Cosmology Structural Timeline
                </h4>
                <div className="flex space-x-1.5 text-[8px] uppercase font-mono">
                  {(['all', 'origins', 'evolution', 'future'] as const).map((cat) => (
                    <button
                      key={cat}
                      className={`px-2 py-0.5 border rounded cursor-pointer ${
                        viewingCosmicCategory === cat
                          ? 'border-violet-500 text-violet-300 bg-violet-500/10'
                          : 'border-slate-800 text-slate-500'
                      }`}
                      onClick={() => setViewingCosmicCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                {COSMIC_EVENTS.filter(e => viewingCosmicCategory === 'all' || e.category === viewingCosmicCategory).map((evt) => (
                  <div key={evt.id} className="border-l-2 border-violet-500/30 hover:border-violet-500 pl-4 py-1 transition">
                    <span className="text-[9px] font-mono text-violet-400 uppercase tracking-widest block font-bold">{evt.timeLabel}</span>
                    <h5 className="text-xs font-bold text-slate-200 mt-0.5 font-display">{evt.title}</h5>
                    <p className="text-[10px] text-slate-400 leading-normal font-sans mt-0.5">{evt.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. BIOCHEM STATION (PERIODIC TABLE & DNA) */}
      {activeTab === 'biochem' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
          {/* Periodic table drawer */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest mb-4">
                Interactive Chemical Elements Core (Period 1-3)
              </h4>
              <p className="text-[11px] text-slate-400 mb-6 font-sans">
                Hover or select any element grid node to check standard atomic configurations, molecule types, and density parameters.
              </p>

              <div className="grid grid-cols-6 gap-3.5">
                {PERIODIC_TABLE.map((el) => (
                  <button
                    key={el.number}
                    onMouseEnter={() => setActiveElement(el)}
                    onClick={() => setActiveElement(el)}
                    className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-between h-20 ${
                      activeElement?.number === el.number
                        ? 'border-violet-500 bg-violet-600/20 text-white shadow-lg glow-primary scale-102'
                        : `${el.colorClass}`
                    }`}
                  >
                    <span className="text-[9px] font-mono text-slate-400 self-start leading-none">{el.number}</span>
                    <span className="text-lg font-bold tracking-tight font-display">{el.symbol}</span>
                    <span className="text-[8px] text-slate-400 truncate max-w-full">{el.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {activeElement && (
              <div className="mt-8 border-t border-white/5 pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h5 className="text-xs font-bold text-violet-400 uppercase tracking-wider font-mono">
                    Element Info: {activeElement.name} ({activeElement.symbol})
                  </h5>
                  <p className="text-[11px] text-slate-400 leading-normal mt-1 max-w-xl font-sans">
                    {activeElement.summary}
                  </p>
                </div>
                <div className="p-3 bg-slate-950/40 rounded-xl border border-white/5 font-mono text-[9px] text-slate-400 shrink-0 space-y-1 text-right">
                  <div>At. Weight: <span className="text-slate-100 font-semibold">{activeElement.weight} u</span></div>
                  <div>Category: <span className="text-slate-100 font-semibold">{activeElement.category}</span></div>
                  <div>Period Grid: <span className="text-slate-100 font-semibold">{activeElement.period} | Group: {activeElement.group}</span></div>
                </div>
              </div>
            )}
          </div>

          {/* DNA helix & Human body overlays */}
          <div className="lg:col-span-1 glass-panel rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2.5 mb-4">
                <Heart className="w-5 h-5 text-rose-500 animate-pulse" />
                <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest">
                  DNA Helix & Human Body Overlays
                </h4>
              </div>

              {/* Animating SVG DNA helix */}
              <div className="h-28 bg-slate-950/20 border border-slate-900 rounded-xl flex items-center justify-center p-4 overflow-hidden mb-6 relative">
                <div className="absolute inset-x-0 bottom-1.5 text-center text-[8px] font-mono text-slate-500 uppercase tracking-widest leading-none">
                  Gene Double Helix Rotation
                </div>
                <svg className="w-full h-full" viewBox="0 0 300 80">
                  {/* Connectors & nodes representing a double helix */}
                  {Array.from({ length: 11 }).map((_, idx) => {
                    const x = 30 + idx * 24;
                    const sinVal = Math.sin(idx * 0.82);
                    const y1 = 40 + sinVal * 20;
                    const y2 = 40 - sinVal * 20;
                    return (
                      <g key={idx}>
                        {/* vertical connector strand */}
                        <line x1={x} y1={y1} x2={x} y2={y2} stroke="rgba(139, 92, 246, 0.4)" strokeWidth={1} />
                        {/* node A */}
                        <circle cx={x} cy={y1} r={3} className={idx % 2 === 0 ? "fill-violet-400 dna-node-up" : "fill-pink-400 dna-node-down"} />
                        {/* node B */}
                        <circle cx={x} cy={y2} r={3} className={idx % 2 === 0 ? "fill-pink-400 dna-node-down" : "fill-violet-400 dna-node-up"} />
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Human Organ Map Toggling */}
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-950/40 p-2 border border-slate-800 rounded-xl">
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Select Active Organ Grid</span>
                  <div className="flex space-x-1">
                    {(['circulatory', 'nervous', 'skeletal'] as const).map((layer) => (
                      <button
                        key={layer}
                        onClick={() => setActiveBodyLayer(layer)}
                        className={`text-[8px] font-mono uppercase px-2 py-0.5 border rounded cursor-pointer ${
                          activeBodyLayer === layer
                            ? 'border-rose-500/40 text-rose-300 bg-rose-500/10'
                            : 'border-slate-800 text-slate-500'
                        }`}
                      >
                        {layer}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Organ information details rendering based on selection */}
                <div className="p-4 rounded-xl border border-white/5 bg-slate-950/20">
                  {activeBodyLayer === 'circulatory' && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-rose-400 font-semibold font-display text-xs">
                        <Heart className="w-4 h-4" />
                        <span>Cardiovascular Integration</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal font-sans">
                        Pumps oxygenated oxygenated blood across 60,000 miles of blood vessels. Highly efficient cardiac muscle system driven by electrical depolarization waves.
                      </p>
                      <div className="mt-2 flex space-x-2 text-[8px] font-mono">
                        <span className="bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded">Core Heart Rate Simulator</span>
                        <span className="bg-rose-500/10 text-rose-400 px-1.5 py-0.5 rounded">Plenary Oxygenation</span>
                      </div>
                    </div>
                  )}

                  {activeBodyLayer === 'nervous' && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sky-400 font-semibold font-display text-xs">
                        <Eye className="w-4 h-4" />
                        <span>Nervous Synaptic Axis</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal font-sans">
                        Flashes electrical action potentials through billions of neurons, connecting the brain cortex directly to biological effector sensory grids in sub-milliseconds.
                      </p>
                      <div className="mt-2 flex space-x-2 text-[8px] font-mono">
                        <span className="bg-sky-500/10 text-sky-400 px-1.5 py-0.5 rounded">86B Synaptic Nodes</span>
                        <span className="bg-sky-500/10 text-sky-400 px-1.5 py-0.5 rounded">Axon Signal Gating</span>
                      </div>
                    </div>
                  )}

                  {activeBodyLayer === 'skeletal' && (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-amber-400 font-semibold font-display text-xs">
                        <Layers className="w-4 h-4" />
                        <span>Structural Skeletal Mesh</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-normal font-sans">
                        Provides protection and modular motion dynamics across 206 rigid ossified bone nodes, housing erythrogenesis factories in the marrow.
                      </p>
                      <div className="mt-2 flex space-x-2 text-[8px] font-mono">
                        <span className="bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded">206 Ossified Nodes</span>
                        <span className="bg-amber-500/10 text-amber-400 px-1.5 py-0.5 rounded">Marrow Erythrogenesis</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. EARTH HISTORY & USGS SEISMIC RADAR */}
      {activeTab === 'eon' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
          {/* Earth eras horizontal interactive timelines */}
          <div className="lg:col-span-2 glass-panel rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest mb-4">
                Earth History Paleontological rail (4.5 Billion Years to Present)
              </h4>
              <p className="text-[11px] text-slate-400 mb-6 font-sans">
                Slide across the geological milestones table to visualize the rapid transition from volatile volcanic debris to hominid civilization.
              </p>

              {/* Horizontal Scroll rail */}
              <div className="flex space-x-3 overflow-x-auto pb-4 scroll-smooth">
                {ERAS.map((era) => (
                  <button
                    key={era.id}
                    onClick={() => setSelectedEra(era)}
                    className={`flex-shrink-0 w-44 p-3 rounded-xl border text-left transition cursor-pointer ${
                      selectedEra.id === era.id
                        ? 'bg-violet-600/10 border-violet-500 text-white'
                        : 'bg-slate-950/30 border-slate-800 hover:border-slate-700 text-slate-400'
                    }`}
                  >
                    <span className="text-[9px] font-mono text-violet-400 uppercase block font-semibold">{era.yearsAgo}</span>
                    <h5 className="text-xs font-bold text-slate-100 mt-1 font-display truncate">{era.title}</h5>
                    <p className="text-[9px] text-slate-500 mt-1 truncate">{era.epoch}</p>
                  </button>
                ))}
              </div>
            </div>

            {selectedEra && (
              <div className="mt-6 p-4 rounded-xl border border-white/5 bg-slate-900/20 flex flex-col md:flex-row gap-5 items-start">
                <img
                  src={selectedEra.imageUrl}
                  alt={selectedEra.title}
                  className="w-full md:w-36 h-24 object-cover rounded-lg border border-white/10"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h5 className="text-xs font-bold text-violet-400 font-mono uppercase tracking-widest">{selectedEra.title} - {selectedEra.epoch}</h5>
                  <p className="text-[11px] text-slate-300 leading-normal mt-1 font-sans">{selectedEra.description}</p>
                  <div className="mt-3.5 pt-3.5 border-t border-slate-800/80">
                    <span className="text-[9px] block font-mono text-slate-500 uppercase font-bold mb-1">Key Evolutionary Milestones:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedEra.keyEvents.map((e, idx) => (
                        <span key={idx} className="bg-violet-500/10 text-violet-300 text-[9px] px-2 py-0.5 rounded border border-violet-500/10 font-sans">
                          {e}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* USGS Seismic incident radar feed */}
          <div className="lg:col-span-1 glass-panel rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2.5">
                <h4 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-widest flex items-center space-x-1.5">
                  <Activity className="w-4 h-4 text-rose-500 animate-pulse" />
                  <span>USGS Live Seismic Feed</span>
                </h4>
                <button
                  onClick={fetchSeismicFeed}
                  className="text-[9px] font-mono hover:text-white text-slate-500 uppercase tracking-wider"
                  title="Refresh satellite incident logs"
                >
                  [Refresh Feed]
                </button>
              </div>

              {seismicLoading ? (
                <div className="p-8 text-center space-y-2">
                  <RefreshCw className="w-5 h-5 animate-spin text-rose-500 mx-auto" />
                  <span className="text-[10px] font-mono text-slate-500">Retrieving satellite earthquake logs...</span>
                </div>
              ) : seismicData.length > 0 ? (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {seismicData.map((eq) => (
                    <div key={eq.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between hover:border-slate-700 hover:bg-slate-900 transition text-left">
                      <div className="space-y-0.5 overflow-hidden">
                        <p className="text-[10px] font-bold text-slate-200 truncate pr-2 font-sans">{eq.place}</p>
                        <p className="text-[9px] text-slate-500 font-mono">
                          Time: {eq.time} • Depth: {eq.depth} km
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          eq.magnitude >= 5.5 ? 'bg-rose-500/20 text-rose-300' : 'bg-slate-800 text-slate-300'
                        }`}>
                          M {eq.magnitude}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No tectonic incidents logged recently.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'stats' && (() => {
        const { pointsWithStatus, anomalies, normal } = getAnomalyDetails();
        
        // Feed the active displayed data (pruned or full) to fit calculators
        const targetDataPairs = anomalyDisplayMode === 'filterOut' ? normal.map(n => ({ x: n.x, y: n.y })) : statsPairs;
        
        const regression = getRegressionLine(targetDataPairs);
        const summary = getFiveNumberSummary(targetDataPairs);
        const activeBinsData = getHistogramData(targetDataPairs);

        const getMetricExplanation = () => {
          switch (hoveredBoxMetric) {
            case 'min':
              return {
                title: "Minimum (Lower Extreme Value)",
                exp: "The smallest value of the active data stream within the lower analytical fence. Shows the physical lower bound.",
                color: "border-sky-500 bg-sky-500/10 text-sky-200"
              };
            case 'q1':
              return {
                title: "Q1 - First Quartile (25th Percentile)",
                exp: "The boundary representing the 25% divider mark. Exactly 25% of the data points fall below this value and 75% lie above it.",
                color: "border-violet-500 bg-violet-500/10 text-violet-200"
              };
            case 'median':
              return {
                title: "Median (50th Percentile / Second Quartile)",
                exp: "The absolute statistical midpoint of the ordered series. Half of the sample set falls strictly above, and half strictly below.",
                color: "border-pink-500 bg-pink-500/10 text-pink-200"
              };
            case 'q3':
              return {
                title: "Q3 - Third Quartile (75th Percentile)",
                exp: "The boundary representing the 75% divider mark. Exactly 75% of data clusters below this point, while 25% lies above.",
                color: "border-fuchsia-500 bg-fuchsia-500/10 text-fuchsia-200"
              };
            case 'max':
              return {
                title: "Maximum (Upper Extreme Value)",
                exp: "The largest value of the active dataset within the upper fence limits, representing the upper extreme boundary.",
                color: "border-indigo-500 bg-indigo-500/10 text-indigo-200"
              };
            case 'mean':
              return {
                title: "Arithmetic Mean (Average Coefficient)",
                exp: "The standard arithmetic average (μ). Shows the centroid of gravity of all values. Hover for premium detail.",
                color: "border-yellow-500 bg-yellow-500/10 text-yellow-250"
              };
            default:
              return {
                title: "Interactive Guide Node",
                exp: "Hover your cursor over any portion of the Box & Whisker plot (min extreme, box boundaries, median ribbon, mean diamond, or outliers) to stream explanatory statistical notes here.",
                color: "border-slate-800 bg-slate-900/40 text-slate-400"
              };
          }
        };

        const explanation = getMetricExplanation();

        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
            {/* Left Control Panel */}
            <div className="lg:col-span-1 space-y-6">
              {/* Presets and Quick Seeds */}
              <div className="glass-panel rounded-2xl p-6">
                <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest mb-3 flex items-center space-x-2 animate-fadeIn">
                  <Database className="w-4 h-4 text-violet-400" />
                  <span>Interactive Preset Datasets</span>
                </h4>
                <p className="text-[11px] text-slate-400 mb-4 font-sans leading-relaxed">
                  Select a live research subject model to instantly seed values and explore different plots.
                </p>

                <div className="space-y-2">
                  {STATS_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setStatsPairs(preset.data);
                        addAuditLog(`Loaded preset: "${preset.name}"`, 'SUCCESS');
                      }}
                      className="w-full p-2.5 rounded-xl border border-white/5 bg-slate-900/30 text-left hover:bg-slate-900/65 transition cursor-pointer group"
                    >
                      <div className="flex justify-between items-center font-sans font-semibold">
                        <span className="text-xs text-white group-hover:text-violet-400 transition font-display">
                          {preset.name}
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 font-bold">N={preset.data.length}</span>
                      </div>
                      <p className="text-[9px] text-slate-400 mt-1 font-sans line-clamp-1">
                        {preset.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Anomaly Diagnostics Panel */}
              <div className="glass-panel rounded-2xl p-6 border-l-2 border-l-rose-500/55 shadow-lg bg-slate-950/20">
                <h4 className="text-xs font-bold font-mono text-rose-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 animate-pulse" />
                    <span>Outliers & Anomaly Lab</span>
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-300 font-mono">LIVE</span>
                </h4>
                <p className="text-[10px] text-slate-400 mb-4 leading-relaxed">
                  Trigger different scientific algorithms to scan vectors in real-time, tag mathematical anomalies, and scrub noisy measurements.
                </p>

                {/* Alg Selector */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[9px] font-mono text-slate-500 uppercase mb-1">Detection Method</label>
                    <div className="grid grid-cols-3 gap-1">
                      {([
                        { id: 'iqr', label: 'Tukey IQR' },
                        { id: 'zscore', label: 'Z-Score' },
                        { id: 'mad', label: 'Robust MAD' }
                      ] as const).map((alg) => (
                        <button
                          key={alg.id}
                          onClick={() => {
                            setAnomalyAlgorithm(alg.id);
                            addAuditLog(`Switched outlier detection model to ${alg.label}`, 'SUCCESS');
                          }}
                          className={`text-[9.5px] font-mono py-1 rounded text-center border cursor-pointer transition ${
                            anomalyAlgorithm === alg.id
                              ? 'border-rose-500 bg-rose-500/10 text-rose-300 font-semibold'
                              : 'border-slate-800 hover:border-slate-750 text-slate-500 hover:text-slate-350 bg-slate-950/20'
                          }`}
                        >
                          {alg.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Threshold Sliders */}
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5 space-y-2">
                    {anomalyAlgorithm === 'iqr' && (
                      <div>
                        <div className="flex justify-between items-center text-[9px] font-mono mb-1">
                          <span className="text-slate-400">IQ Reach Factor (k)</span>
                          <span className="text-rose-400 font-bold">{iqrFactor.toFixed(1)}× IQR</span>
                        </div>
                        <input
                          type="range"
                          min="1.0"
                          max="3.0"
                          step="0.1"
                          className="accent-rose-500 w-full h-1 cursor-pointer bg-slate-850 rounded"
                          value={iqrFactor}
                          onChange={(e) => setIqrFactor(parseFloat(e.target.value))}
                        />
                        <p className="text-[8px] text-slate-500 font-sans mt-1">
                          Scans bounds: <span className="font-mono text-[8px]">Q1 - k(IQR)</span> to <span className="font-mono text-[8px]">Q3 + k(IQR)</span>. 1.5 standard, 3.0 extreme.
                        </p>
                      </div>
                    )}

                    {anomalyAlgorithm === 'zscore' && (
                      <div>
                        <div className="flex justify-between items-center text-[9px] font-mono mb-1">
                          <span className="text-slate-400">σ Threshold (Z-Limit)</span>
                          <span className="text-rose-400 font-bold">±{zScoreThreshold.toFixed(1)} StdDev</span>
                        </div>
                        <input
                          type="range"
                          min="1.0"
                          max="3.5"
                          step="0.1"
                          className="accent-rose-500 w-full h-1 cursor-pointer bg-slate-850 rounded"
                          value={zScoreThreshold}
                          onChange={(e) => setZScoreThreshold(parseFloat(e.target.value))}
                        />
                        <p className="text-[8px] text-slate-500 font-sans mt-1">
                          Scores points based on distance from the mean divided by standard deviation: <span className="font-mono text-[8px]">|Z| &gt; threshold</span>.
                        </p>
                      </div>
                    )}

                    {anomalyAlgorithm === 'mad' && (
                      <div>
                        <div className="flex justify-between items-center text-[9px] font-mono mb-1">
                          <span className="text-slate-400">Modified Z-Score (MAD)</span>
                          <span className="text-rose-400 font-bold">±{madThreshold.toFixed(1)} MAD</span>
                        </div>
                        <input
                          type="range"
                          min="1.5"
                          max="5.0"
                          step="0.1"
                          className="accent-rose-500 w-full h-1 cursor-pointer bg-slate-850 rounded"
                          value={madThreshold}
                          onChange={(e) => setMadThreshold(parseFloat(e.target.value))}
                        />
                        <p className="text-[8px] text-slate-500 font-sans mt-1">
                          Robust score immune to extreme skews. Calculated ratio: <span className="font-mono text-[8px]">0.6745·(y_i - M) / MAD</span>.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions / Filter Mode selectors */}
                  <div>
                    <label className="block text-[9px] font-mono text-slate-500 uppercase mb-1">Diagnostic Mode Action</label>
                    <div className="grid grid-cols-3 gap-1">
                      {([
                        { id: 'highlight', label: 'Highlight', desc: 'Identify glow' },
                        { id: 'filterOut', label: 'Scrub Data', desc: 'Auto-exclude' },
                        { id: 'normal', label: 'Bypass', desc: 'Vanilla' }
                      ] as const).map((mode) => (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => {
                            setAnomalyDisplayMode(mode.id);
                            addAuditLog(`Switched diagnostic action to: ${mode.label}`, 'SUCCESS');
                          }}
                          className={`flex flex-col items-center justify-center py-1.5 px-1 rounded text-center border cursor-pointer transition ${
                            anomalyDisplayMode === mode.id
                              ? 'border-violet-500 bg-violet-600/10 text-violet-300 font-semibold shadow-sm'
                              : 'border-slate-800 hover:border-slate-750 text-slate-500 hover:text-slate-350 bg-slate-950/20'
                          }`}
                        >
                          <span className="text-[9.5px] font-mono">{mode.label}</span>
                          <span className="text-[7.5px] text-slate-500 font-sans tracking-tight block leading-normal">{mode.desc}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Variable Input / Manual Form */}
              <div className="glass-panel rounded-2xl p-6">
                <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest mb-4 flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-violet-400" />
                  <span>Manual Input Matrix</span>
                </h4>

                <form onSubmit={handleAddStatsPoint} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[9px] font-mono text-slate-500 uppercase mb-1">X Vector (Independent)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 50"
                        className="w-full text-xs bg-slate-950 text-slate-200 border border-slate-850 rounded-lg px-3 py-2 outline-none focus:border-violet-500"
                        value={newX}
                        onChange={(e) => setNewX(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-mono text-slate-500 uppercase mb-1">Y Vector (Dependent)</label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="e.g. 62.5"
                        className="w-full text-xs bg-slate-950 text-slate-200 border border-slate-850 rounded-lg px-3 py-2 outline-none focus:border-violet-500"
                        value={newY}
                        onChange={(e) => setNewY(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-violet-600 to-indigo-600 font-semibold hover:from-violet-500 hover:to-indigo-500 text-xs text-white rounded-lg cursor-pointer flex items-center justify-center space-x-1.5 shadow"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Insert Data Pair</span>
                  </button>
                </form>

                <div className="relative flex py-4 items-center">
                  <div className="flex-grow border-t border-white/5"></div>
                  <span className="flex-shrink mx-3 text-[9px] font-mono text-slate-500 uppercase">Or Batch Loader</span>
                  <div className="flex-grow border-t border-white/5"></div>
                </div>

                <form onSubmit={handleBatchParse} className="space-y-3">
                  <div>
                    <label className="block text-[9px] font-mono text-slate-500 uppercase mb-1">Raw Sample List (Y values)</label>
                    <textarea
                      placeholder="e.g., 22.5, 34.0, 41.5, 12, 19.5, 54, 62"
                      rows={2}
                      className="w-full text-[11px] font-mono bg-slate-950 text-slate-200 border border-slate-850 rounded-lg p-2.5 outline-none focus:border-violet-500 resize-none"
                      value={rawInputText}
                      onChange={(e) => setRawInputText(e.target.value)}
                    />
                    <p className="text-[8px] text-slate-500 font-sans mt-1">
                      Separated by comma, spaces, or lines. X coordinates generated as sequential indexes.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-1.5 bg-slate-900 border border-white/10 text-[10px] uppercase font-mono tracking-wider font-semibold hover:bg-slate-850 text-slate-200 rounded-lg cursor-pointer"
                  >
                    Batch Parse Sample Array
                  </button>
                </form>

                <div className="mt-6 border-t border-white/5 pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9px] font-mono text-slate-500 uppercase font-bold text-left block">Active Vectors ({statsPairs.length})</span>
                    <button
                      type="button"
                      onClick={clearStatsPoints}
                      className="text-[9px] font-mono hover:text-white text-rose-500 uppercase cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Scrollable vector coordinates list */}
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {pointsWithStatus.map((p, idx) => (
                      <div 
                        key={idx} 
                        className={`px-3 py-1.5 rounded border flex justify-between items-center text-[10px] font-mono transition duration-150 ${
                          p.isAnomaly && anomalyDisplayMode === 'highlight'
                            ? 'bg-rose-950/20 border-rose-900/40 text-rose-200' 
                            : 'bg-slate-950/40 border-slate-900 text-slate-300'
                        }`}
                      >
                        <div className="flex flex-col text-left">
                          <span className={`flex items-center space-x-1 ${p.isAnomaly && anomalyDisplayMode === 'highlight' ? 'text-rose-450 font-bold' : 'text-slate-400'}`}>
                            <span>Node #{idx + 1}</span>
                            {p.isAnomaly && anomalyDisplayMode === 'highlight' && <span className="text-[8px] px-1 bg-rose-500/25 rounded font-semibold text-rose-350 leading-none">OUTLIER</span>}
                          </span>
                          <span className="text-[8px] text-slate-500 font-sans mt-0.5 leading-none">{p.scoreLabel}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <span className={`font-semibold ${p.isAnomaly && anomalyDisplayMode === 'highlight' ? 'text-rose-200' : 'text-violet-400'}`}>
                            ({p.x}, {p.y})
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteStatsPoint(idx)}
                            className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition cursor-pointer text-left"
                            title="Scrub point from core matrix dataset"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Plotting Canvas & Custom Views */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 border-b border-white/5 pb-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 font-mono uppercase tracking-widest flex items-center space-x-2">
                        <BarChart2 className="w-4 h-4 text-violet-400" />
                        <span>Statistical Discovery Plot Canvas</span>
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 text-left">
                        Interactive telemetry processor showcasing distribution curves, quartiles, anomalies, and live histograms.
                      </p>
                    </div>

                    {/* Chart Selector Tab Buttons */}
                    <div className="flex flex-wrap gap-1">
                      {([
                        { id: 'scatter', label: 'Scatter plot' },
                        { id: 'histogram', label: 'Histogram' },
                        { id: 'boxplot', label: 'Box plot' },
                        { id: 'bar', label: 'Bar sequence' },
                        { id: 'line', label: 'Line curve' }
                      ] as const).map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setChartType(tab.id)}
                          className={`text-[9px] font-mono uppercase px-2.5 py-1 border rounded transition cursor-pointer ${
                            chartType === tab.id
                              ? 'border-violet-500 text-violet-300 bg-violet-600/10 shadow-sm'
                              : 'border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Active Chart View container */}
                  <div id="telemetry-chart-container" className="w-full h-80 bg-slate-950/45 rounded-xl border border-white/5 p-4 flex flex-col justify-center relative">
                    {statsPairs.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-xs text-slate-500 p-8 space-y-2">
                        <ShieldAlert className="w-6 h-6 text-slate-600 animate-pulse" />
                        <span>Empty data matrix registered. Select a preset or insert variables on the left.</span>
                      </div>
                    ) : (
                      <>
                        {/* Option control bar inside plot (generalized for regression overlays) */}
                        {(chartType === 'scatter' || chartType === 'line' || chartType === 'bar') && (
                          <div className="absolute top-2.5 right-6 z-20 flex items-center space-x-2 text-[9px] font-mono text-slate-400">
                            <label className="flex items-center space-x-1.5 cursor-pointer bg-slate-900/60 px-2 py-1 rounded border border-white/5">
                              <input
                                  type="checkbox"
                                  className="accent-violet-500 h-3 w-3 cursor-pointer"
                                  checked={showTrendLine}
                                  onChange={(e) => setShowTrendLine(e.target.checked)}
                              />
                              <span>Show least-squares fit line</span>
                            </label>
                          </div>
                        )}

                        {/* CHART: SCATTER */}
                        {chartType === 'scatter' && (
                          <div className="h-full w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                                <XAxis type="number" dataKey="x" name="X Vector" stroke="#94a3b8" fontSize={9} />
                                <YAxis type="number" dataKey="y" name="Y Vector" stroke="#94a3b8" fontSize={9} />
                                <Tooltip
                                  contentStyle={{ background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                  cursor={{ strokeDasharray: '3 3' }}
                                />
                                <Scatter name="Raw Nodes" data={normal} fill="#a78bfa" stroke="#8b5cf6" strokeWidth={1} />
                                {anomalyDisplayMode === 'highlight' && anomalies.length > 0 && (
                                  <Scatter name="Anomaly Alerts" data={anomalies} fill="#f43f5e" stroke="#e11d48" strokeWidth={2} shape="star" line={false} />
                                )}
                                {anomalyDisplayMode === 'normal' && (
                                  <Scatter name="Bypassed Data Nodes" data={statsPairs} fill="#a78bfa" stroke="#8b5cf6" strokeWidth={1} />
                                )}
                                {showTrendLine && regression && (
                                  <Scatter
                                    name="Least-Squares fit line"
                                    data={regression.points}
                                    fill="#f43f5e"
                                    opacity={0.8}
                                    line={{ stroke: '#f43f5e', strokeWidth: 1.5, strokeDasharray: '4 4' }}
                                    shape={() => null}
                                  />
                                )}
                              </ScatterChart>
                            </ResponsiveContainer>
                          </div>
                        )}

                        {/* CHART: HISTOGRAM */}
                        {chartType === 'histogram' && (
                          <div className="h-full w-full flex flex-col justify-between animate-fadeIn">
                            <ResponsiveContainer width="100%" height="86%">
                              <BarChart data={activeBinsData} margin={{ top: 10, right: 20, bottom: 10, left: -20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                                <XAxis dataKey="binLabel" stroke="#94a3b8" fontSize={8} />
                                <YAxis stroke="#94a3b8" fontSize={9} />
                                <Tooltip
                                  contentStyle={{ background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                  formatter={(value) => [`${value} values`, 'Bin Frequency']}
                                />
                                <Bar dataKey="frequency" fill="#ec4899" radius={[4, 4, 0, 0]}>
                                  {activeBinsData.map((bin, index) => {
                                    const containsAnomaly = anomalies.some(a => a.y >= bin.binStart && a.y <= bin.binEnd);
                                    return (
                                      <Cell 
                                        key={`bin-cell-${index}`} 
                                        fill={containsAnomaly && anomalyDisplayMode === 'highlight' ? '#f43f5e' : '#ec4899'} 
                                      />
                                    );
                                  })}
                                </Bar>
                              </BarChart>
                            </ResponsiveContainer>

                            {/* Histogram Bin tuning control slider */}
                            <div className="flex items-center justify-between px-2 pt-2 border-t border-white/5 bg-slate-900/30 rounded-lg">
                              <span className="text-[10px] font-mono text-slate-400 flex items-center space-x-1">
                                <Sliders className="w-3 h-3 text-pink-400" />
                                <span>Density scale: <strong className="text-pink-300">{binCount} subdivisions</strong></span>
                              </span>
                              <input
                                type="range"
                                min={3}
                                max={12}
                                className="accent-pink-500 w-32 h-1 cursor-pointer bg-slate-800 rounded-lg"
                                value={binCount}
                                onChange={(e) => setBinCount(parseInt(e.target.value))}
                              />
                            </div>
                          </div>
                        )}

                        {/* CHART: BOX & WHISKER PLOT */}
                        {chartType === 'boxplot' && (
                          <div className="h-full w-full flex flex-col justify-between overflow-visible">
                            {summary ? (
                              <>
                                {/* Beautiful Horizontal SVG boxplot */}
                                <div className="flex-1 flex items-center justify-center py-2 overflow-visible">
                                  <svg viewBox="0 0 600 130" className="w-full overflow-visible select-none h-44">
                                    {/* Grids mapping guidelines */}
                                    <line x1="8%" y1="15" x2="92%" y2="15" stroke="rgba(255,255,255,0.02)" />
                                    <line x1="8%" y1="65" x2="92%" y2="65" stroke="rgba(255,255,255,0.02)" />
                                    <line x1="8%" y1="115" x2="92%" y2="115" stroke="rgba(255,255,255,0.02)" />

                                    {(() => {
                                      // Scale coordinate space relative to the absolute boundary of ALL variables (ignores filters so coordinates hold still)
                                      const allY = statsPairs.map(p => p.y);
                                      const scaleMin = Math.min(...allY);
                                      const scaleMax = Math.max(...allY);
                                      const range = scaleMax - scaleMin;
                                      
                                      const getRelativeX = (val: number) => {
                                        if (range === 0) return 300;
                                        return 48 + ((val - scaleMin) / range) * 504; // scale onto svg map space (48 to 552)
                                      };

                                      const xMin = getRelativeX(summary.min);
                                      const xQ1 = getRelativeX(summary.q1);
                                      const xMedian = getRelativeX(summary.median);
                                      const xQ3 = getRelativeX(summary.q3);
                                      const xMax = getRelativeX(summary.max);
                                      const xMean = getRelativeX(summary.mean);

                                      return (
                                        <g>
                                          {/* Whisker line background connector */}
                                          <line
                                            x1={xMin}
                                            y1="65"
                                            x2={xMax}
                                            y2="65"
                                            stroke="#6366f1"
                                            strokeWidth="1.5"
                                            strokeDasharray="4 4"
                                            onMouseEnter={() => setHoveredBoxMetric('q1')}
                                          />

                                          {/* Whisker End-Ticks */}
                                          <line x1={xMin} y1="50" x2={xMin} y2="80" stroke="#6366f1" strokeWidth="2.5" onMouseEnter={() => setHoveredBoxMetric('min')} />
                                          <line x1={xMax} y1="50" x2={xMax} y2="80" stroke="#6366f1" strokeWidth="2.5" onMouseEnter={() => setHoveredBoxMetric('max')} />

                                          {/* Direct Text Labels for ends */}
                                          <text x={xMin - 12} y="70" fill="#818cf8" fontSize="8" fontFamily="monospace" textAnchor="end">{summary.min.toFixed(1)}</text>
                                          <text x={xMax + 12} y="70" fill="#818cf8" fontSize="8" fontFamily="monospace" textAnchor="start">{summary.max.toFixed(1)}</text>

                                          {/* Interquartile Box rectangle */}
                                          <rect
                                            x={xQ1}
                                            y="35"
                                            width={Math.max(3, xQ3 - xQ1)}
                                            height="60"
                                            fill="rgba(139, 92, 246, 0.16)"
                                            stroke="#8b5cf6"
                                            strokeWidth="2"
                                            className="transition-colors hover:fill-violet-500/25 duration-200 cursor-pointer"
                                            onMouseEnter={() => setHoveredBoxMetric('q3')}
                                          />

                                          {/* Q1 / Q3 numeric descriptors above */}
                                          <text x={xQ1} y="25" fill="#a78bfa" fontSize="8" fontFamily="monospace" textAnchor="middle">Q1: {summary.q1.toFixed(1)}</text>
                                          <text x={xQ3} y="25" fill="#f472b6" fontSize="8" fontFamily="monospace" textAnchor="middle">Q3: {summary.q3.toFixed(1)}</text>

                                          {/* Median vertical line ribbon */}
                                          <line
                                            x1={xMedian}
                                            y1="35"
                                            x2={xMedian}
                                            y2="95"
                                            stroke="#ec4899"
                                            strokeWidth="3.5"
                                            className="cursor-pointer hover:stroke-pink-400"
                                            onMouseEnter={() => setHoveredBoxMetric('median')}
                                          />
                                          <text x={xMedian} y="112" fill="#f472b6" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                                            Med: {summary.median.toFixed(1)}
                                          </text>

                                          {/* Arithmetic Mean overlay (diamond shape) */}
                                          <polygon
                                            points={`${xMean},60 ${xMean + 5},65 ${xMean},70 ${xMean - 5},65`}
                                            fill="#eab308"
                                            stroke="#ca8a04"
                                            className="cursor-pointer hover:fill-yellow-300"
                                            onMouseEnter={() => setHoveredBoxMetric('mean')}
                                          />
                                          
                                          {/* Outliers dots map matching active algorithm parameters */}
                                          {anomalyDisplayMode === 'highlight' && anomalies.map((p, oIdx) => {
                                            const cx = getRelativeX(p.y);
                                            return (
                                              <g key={oIdx}>
                                                <circle cx={cx} cy="65" r="5.5" fill="#f43f5e" className="animate-ping opacity-35" />
                                                <circle cx={cx} cy="65" r="3.5" fill="#e11d48" />
                                                <title>Anomaly outlier detected: {p.y.toFixed(2)} ({p.scoreLabel})</title>
                                              </g>
                                            );
                                          })}
                                        </g>
                                      );
                                    })()}
                                  </svg>
                                </div>

                                {/* Dynamic Lesson card showing explanatory guides on hover */}
                                <div
                                  className={`mt-2 p-3 border rounded-xl text-left transition duration-200 ${explanation.color}`}
                                  onMouseLeave={() => setHoveredBoxMetric(null)}
                                >
                                  <h6 className="text-[10px] font-mono uppercase tracking-wider font-bold mb-0.5">
                                    {explanation.title}
                                  </h6>
                                  <p className="text-[10px] font-sans leading-normal">
                                    {explanation.exp}
                                  </p>
                                </div>
                              </>
                            ) : (
                              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                                Box-plot parameters could not be simulated.
                              </div>
                            )}
                          </div>
                        )}

                        {/* CHART: BAR SEQUENCE */}
                        {chartType === 'bar' && (() => {
                          const enrichedBarData = regression && showTrendLine 
                            ? targetDataPairs.map(point => ({
                                ...point,
                                trendY: Number((regression.slope * point.x + regression.intercept).toFixed(4))
                              }))
                            : targetDataPairs;
                          return (
                            <div className="h-full w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={enrichedBarData} margin={{ top: 15, right: 10, bottom: 10, left: -25 }}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                                  <XAxis dataKey="x" stroke="#94a3b8" fontSize={9} />
                                  <YAxis stroke="#94a3b8" fontSize={9} />
                                  <Tooltip contentStyle={{ background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                                  <Bar dataKey="y" fill="#a78bfa" radius={[4, 4, 0, 0]}>
                                    {enrichedBarData.map((entry, index) => {
                                      const isAnomaly = anomalies.some(a => a.x === entry.x && a.y === entry.y);
                                      return (
                                        <Cell 
                                          key={`bar-cell-${index}`} 
                                          fill={isAnomaly && anomalyDisplayMode === 'highlight' ? '#f43f5e' : '#a78bfa'} 
                                        />
                                      );
                                    })}
                                  </Bar>
                                  {showTrendLine && regression && (
                                    <Line
                                      type="monotone"
                                      dataKey="trendY"
                                      stroke="#f43f5e"
                                      strokeWidth={2.5}
                                      strokeDasharray="5 5"
                                      dot={false}
                                      name="Least-Squares Trend"
                                    />
                                  )}
                                </BarChart>
                              </ResponsiveContainer>
                            </div>
                          );
                        })()}

                        {/* CHART: LINE CURVE */}
                        {chartType === 'line' && (() => {
                          const enrichedLineData = regression && showTrendLine 
                            ? targetDataPairs.map(point => ({
                                ...point,
                                trendY: Number((regression.slope * point.x + regression.intercept).toFixed(4))
                              }))
                            : targetDataPairs;
                          return (
                            <div className="h-full w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={enrichedLineData} margin={{ top: 15, right: 10, bottom: 10, left: -25 }}>
                                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                                  <XAxis dataKey="x" stroke="#94a3b8" fontSize={9} />
                                  <YAxis stroke="#94a3b8" fontSize={9} />
                                  <Tooltip contentStyle={{ background: '#090d16', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                                  <Line 
                                    type="monotone" 
                                    dataKey="y" 
                                    stroke="#ec4899" 
                                    strokeWidth={2} 
                                    dot={(props) => {
                                      const { cx, cy, payload } = props;
                                      const isAnomaly = anomalies.some(a => a.x === payload.x && a.y === payload.y);
                                      if (isAnomaly && anomalyDisplayMode === 'highlight') {
                                        return (
                                          <g key={`dot-${payload.x}-${payload.y}`}>
                                            <circle cx={cx} cy={cy} r="6.5" fill="#f43f5e" stroke="#000" strokeWidth={1} className="animate-pulse" />
                                            <circle cx={cx} cy={cy} r="3" fill="#fff" />
                                          </g>
                                        );
                                      }
                                      return (
                                        <circle key={`dot-${payload.x}-${payload.y}`} cx={cx} cy={cy} r={3.5} fill="#ec4899" stroke="#000" strokeWidth={0.5} />
                                      );
                                    }}
                                    activeDot={{ r: 5 }} 
                                  />
                                  {showTrendLine && regression && (
                                    <Line
                                      type="monotone"
                                      dataKey="trendY"
                                      stroke="#f43f5e"
                                      strokeWidth={2.5}
                                      strokeDasharray="5 5"
                                      dot={false}
                                      name="Least-Squares Trend"
                                    />
                                  )}
                                </LineChart>
                              </ResponsiveContainer>
                            </div>
                          );
                        })()}
                      </>
                    )}
                  </div>
                </div>

                {/* Exporters and control rails footer */}
                <div className="mt-4 flex flex-wrap gap-2 items-center justify-between border-t border-white/5 pt-4">
                  {/* Dynamic formula overlay for regression fits */}
                  {(chartType === 'scatter' || chartType === 'line' || chartType === 'bar') && regression ? (
                    <div className="text-[10px] font-mono text-slate-400 bg-slate-900/60 border border-white/5 px-3 py-1.5 rounded-lg text-left">
                      Fit Formula: <span className="text-violet-400 font-bold font-mono text-[10px]">Y = {regression.slope.toFixed(3)}x + {regression.intercept.toFixed(2)}</span>
                      <span className="text-slate-500 mx-2 font-mono">•</span>
                      R² ratio: <span className="text-pink-400 font-bold font-mono text-[10px]">{(regression.rSquared).toFixed(4)}</span>
                    </div>
                  ) : (
                    <div className="text-[10px] font-mono text-slate-500 text-left font-sans">
                      Sample dimensions: <span className="text-slate-300 font-semibold text-[10px]">N = {targetDataPairs.length} coordinates</span>
                      {anomalyDisplayMode === 'filterOut' && (
                        <span className="text-rose-400 font-semibold font-mono text-[9px] ml-2">({anomalies.length} outliers scrubbed)</span>
                      )}
                    </div>
                  )}

                  {/* Visual Image Exporter cluster */}
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => exportChartAsImage('png')}
                      disabled={statsPairs.length === 0}
                      className="px-3 py-1.5 bg-violet-600/90 text-white rounded-lg hover:bg-violet-600 text-[10px] uppercase font-mono tracking-wider flex items-center space-x-1 hover:scale-101 active:scale-99 transition disabled:opacity-40 cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Export PNG Image</span>
                    </button>
                    <button
                      onClick={() => exportChartAsImage('svg')}
                      disabled={statsPairs.length === 0}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 rounded-lg text-[10px] uppercase font-mono tracking-wider flex items-center space-x-1 transition disabled:opacity-40 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export Vector SVG</span>
                    </button>
                    <button
                      onClick={exportStatsDetails}
                      disabled={statsPairs.length === 0}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg text-[10px] uppercase font-mono tracking-wider flex items-center space-x-1 transition disabled:opacity-40 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-400" />
                      <span>JSON Data</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Advanced Live Descriptive Metrics card */}
              {summary && (
                <div className="glass-panel rounded-2xl p-6">
                  <h5 className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold mb-4 text-left">
                    Descriptive Algebra & Telemetry Metrics Summary {anomalyDisplayMode === 'filterOut' && <span className="text-rose-400 font-mono text-[9px] lowercase animate-pulse">(filtered/scrubbed dataset)</span>}
                  </h5>

                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                    <div className="p-3 rounded-xl border border-white/5 bg-slate-950/25 text-left">
                      <span className="text-[9px] font-mono text-slate-400 uppercase block">Sample Mean (μ)</span>
                      <strong className="text-base text-white font-display block mt-1">{summary.mean.toFixed(3)}</strong>
                      <span className="text-[8px] text-slate-500 font-mono italic block mt-0.5 leading-none">Centroid gravity average</span>
                    </div>

                    <div className="p-3 rounded-xl border border-white/5 bg-slate-950/25 text-left">
                      <span className="text-[9px] font-mono text-slate-400 uppercase block">Sample Median (M)</span>
                      <strong className="text-base text-violet-300 font-display block mt-1">{summary.median.toFixed(2)}</strong>
                      <span className="text-[8px] text-slate-500 font-mono italic block mt-0.5 leading-none">Middle 50% divider</span>
                    </div>

                    <div className="p-3 rounded-xl border border-white/5 bg-slate-950/25 text-left">
                      <span className="text-[9px] font-mono text-slate-400 uppercase block">Std Deviation (σ)</span>
                      <strong className="text-base text-pink-300 font-display block mt-1">{summary.stdDev.toFixed(3)}</strong>
                      <span className="text-[8px] text-slate-500 font-mono italic block mt-0.5 leading-none">Sample dispersion reach</span>
                    </div>

                    <div className="p-3 rounded-xl border border-white/5 bg-slate-950/25 text-left">
                      <span className="text-[9px] font-mono text-slate-400 uppercase block">Interquartile Range</span>
                      <strong className="text-base text-fuchsia-300 font-display block mt-1">{summary.iqr.toFixed(2)}</strong>
                      <span className="text-[8px] text-slate-500 font-mono italic block mt-0.5 leading-none">Mid-50% box spread</span>
                    </div>

                    <div className="p-3 rounded-xl border border-white/5 bg-slate-950/25 col-span-2 lg:col-span-1 text-left">
                      <span className="text-[9px] font-mono text-slate-400 uppercase block">Anomalies Detected</span>
                      <strong className={`text-base font-display block mt-1 ${anomalies.length > 0 ? 'text-rose-455 font-bold text-rose-400 animate-pulse' : 'text-slate-400'}`}>
                        {anomalies.length} units
                      </strong>
                      <span className="text-[8px] text-slate-500 font-mono italic block mt-0.5 leading-none">Via inactive algorithm filter</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Detected anomalies table report */}
              {anomalies.length > 0 && (
                <div className="glass-panel rounded-2xl p-6 border border-rose-500/10 bg-rose-950/5 animate-fadeIn">
                  <h5 className="text-[10px] font-mono text-rose-350 uppercase tracking-widest font-bold mb-3 flex items-center space-x-1.5 text-left">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>Real-time Anomaly diagnostic report log</span>
                  </h5>
                  <p className="text-[10px] text-slate-400 mb-4 leading-normal text-left">
                    The following measurements exceed threshold parameters defined by the selected logic method <strong className="text-slate-350 uppercase">{anomalyAlgorithm}</strong>.
                  </p>

                  <div className="border border-white/5 rounded-xl overflow-hidden bg-slate-950/80">
                    <table className="w-full text-left border-collapse text-[11px] font-mono">
                      <thead>
                        <tr className="bg-slate-900 border-b border-white/5 text-slate-400 text-[10px]">
                          <th className="p-2.5">Node Index</th>
                          <th className="p-2.5">Coordinate (X, Y)</th>
                          <th className="p-2.5">Method Reason / Deviation Score</th>
                          <th className="p-2.5 text-right">Laboratory Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-slate-300">
                        {anomalies.map((anom) => (
                          <tr key={anom.index} className="hover:bg-rose-950/10 transition">
                            <td className="p-2.5">
                              <span className="text-slate-500">#{anom.index}</span>
                            </td>
                            <td className="p-2.5 font-semibold text-rose-300">
                              X: {anom.x.toFixed(1)} • Y: {anom.y.toFixed(2)}
                            </td>
                            <td className="p-2.5">
                              <span className="text-[10px] bg-rose-500/10 px-2 py-0.5 rounded text-rose-400 border border-rose-500/10">
                                {anom.scoreLabel}
                              </span>
                            </td>
                            <td className="p-2.5 text-right">
                              <button
                                type="button"
                                onClick={() => handleDeleteStatsPoint(anom.index - 1)}
                                className="px-2.5 py-1 rounded bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 text-[9px] uppercase font-mono tracking-wider transition border border-rose-500/10 cursor-pointer"
                                title="Scrub coordinate"
                              >
                                Scrub Point
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </div>
  );
};
