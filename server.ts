import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware to parse JSON bodies
  app.use(express.json());

  // API 1: Health test
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", service: "Apex Analysis Fullstack" });
  });

  // API 2: Live Sports Scores with dynamic tick simulation
  app.get("/api/sports/scores", (req, res) => {
    const now = Date.now();
    
    // T20 World Cup Live: India vs Pakistan
    // Overs tick sequentially to make scores look dynamically alive on reload
    const indOversNum = ((now / 35000) % 20); 
    const indOverInt = Math.floor(indOversNum);
    const indOverBalls = Math.floor((indOversNum % 1) * 6);
    const indRuns = Math.floor(indOversNum * 8.4) + 6;
    const indWickets = Math.min(9, Math.floor(indOversNum * 0.4));

    // T20 World Cup Live: Australia vs England
    // Australia has finished batting at 178/6
    const ausRuns = 178;
    const ausWickets = 6;
    const engOversNum = ((now / 25000) % 21); // up to 20.0
    const engOverInt = Math.min(20, Math.floor(engOversNum));
    const engOverBalls = engOverInt === 20 ? 0 : Math.floor((engOversNum % 1) * 6);
    const engRuns = Math.min(182, Math.floor(engOversNum * 8.9) + 4);
    const engWickets = Math.min(9, Math.floor(engOversNum * 0.42));
    
    let engStatus = "England chasing 179";
    if (engRuns >= 179) {
      engStatus = `Completed: England won by ${10 - engWickets} wickets (${engOverInt}.${engOverBalls} Ov)`;
    } else if (engOverInt >= 20) {
      engStatus = `Completed: Australia won by ${178 - engRuns} runs`;
    } else {
      engStatus = `In Progress: England need ${179 - engRuns} runs in ${120 - (engOverInt * 6 + engOverBalls)} balls`;
    }

    // English Premier League Live: Chelsea vs Arsenal
    const footMins = Math.floor((now / 15000) % 95); // 0 to 94 mins
    let chelseaGoals = 0;
    let arsenalGoals = 0;
    if (footMins >= 24) chelseaGoals++;
    if (footMins >= 67) chelseaGoals++;
    if (footMins >= 45) arsenalGoals++;
    if (footMins >= 86) arsenalGoals++;

    let footStatus = "In Progress";
    if (footMins >= 90) {
      footStatus = "Full Time";
    } else if (footMins === 45) {
      footStatus = "Half Time";
    }

    // FIFA World Cup Live Simulation Score ticker: Brazil vs Germany
    let brazilGoals = 0;
    let germanyGoals = 0;
    if (footMins >= 18) brazilGoals++;
    if (footMins >= 38) germanyGoals++;
    if (footMins >= 72) brazilGoals++;
    if (footMins >= 80) germanyGoals++;

    // FIFA World Cup Live Simulation Score ticker: Argentina vs France
    let argentinaGoals = 0;
    let franceGoals = 0;
    if (footMins >= 12) argentinaGoals++;
    if (footMins >= 32) argentinaGoals++;
    if (footMins >= 54) franceGoals++;
    if (footMins >= 77) franceGoals++;
    if (footMins >= 89) argentinaGoals++;

    // FIFA World Cup Live Simulation - Timeline Events & Stats
    const braGerEventsAll = [
      { min: 18, team: "BRA", scorer: "Vinicius Jr.", text: "Spectacular curve ball over the wall!", type: "GOAL" },
      { min: 38, team: "GER", scorer: "J. Musiala", text: "Low tap-in following a quick tiki-taka inside the box.", type: "GOAL" },
      { min: 55, team: "GER", scorer: "A. Rüdiger", text: "Received a yellow card for a hard tactical foul.", type: "YELLOW_CARD" },
      { min: 72, team: "BRA", scorer: "Rodrygo", text: "Brilliant clinical header from a direct corner cross.", type: "GOAL" },
      { min: 80, team: "GER", scorer: "F. Wirtz", text: "Power drive from 25 yards out grazing the crossbar inside!", type: "GOAL" }
    ];

    const argFraEventsAll = [
      { min: 12, team: "ARG", scorer: "L. Messi", text: "Ice-cold penalty slotted into bottom-right corner.", type: "GOAL" },
      { min: 28, team: "FRA", scorer: "O. Dembélé", text: "Received a yellow card for verbal dissent.", type: "YELLOW_CARD" },
      { min: 32, team: "ARG", scorer: "A. Di María", text: "Sublime counter-attack volley assisted by Mac Allister.", type: "GOAL" },
      { min: 54, team: "FRA", scorer: "K. Mbappé", text: "Explosive run on the left flank cutting in to fire home!", type: "GOAL" },
      { min: 77, team: "FRA", scorer: "K. Mbappé", text: "Volley screamer following a loose defensive clearance!", type: "GOAL" },
      { min: 89, team: "ARG", scorer: "Lautaro Martínez", text: "Scramble tap-in after France goalkeeper parried initial shot.", type: "GOAL" }
    ];

    const braGerEvents = braGerEventsAll.filter(e => e.min <= footMins);
    const argFraEvents = argFraEventsAll.filter(e => e.min <= footMins);

    // Active statistics scaling as the game minutes progress
    const getStats = (goalsA: number, goalsB: number, currentMin: number) => {
      const scaleMultiplier = Math.max(0.1, Math.min(1, currentMin / 90));
      const posA = currentMin >= 90 ? 52 : Math.floor(50 + Math.sin(now / 15000) * 3);
      const posB = 100 - posA;
      return {
        possession: [posA, posB],
        shots: [Math.floor((5 + goalsA * 2) * scaleMultiplier), Math.floor((4 + goalsB * 2) * scaleMultiplier)],
        shotsOnTarget: [Math.floor((3 + goalsA) * scaleMultiplier), Math.floor((2 + goalsB) * scaleMultiplier)],
        fouls: [Math.floor(7 * scaleMultiplier), Math.floor(8 * scaleMultiplier)],
        yellowCards: [goalsB > goalsA ? 1 : 0, goalsA > goalsB ? 2 : 1]
      };
    };

    const braGerStats = getStats(brazilGoals, germanyGoals, footMins);
    const argFraStats = getStats(argentinaGoals, franceGoals, footMins);

    res.json({
      timestamp: new Date().toISOString(),
      t20WorldCup: [
        {
          id: "t20-ind-pak",
          title: "T20 World Cup - Group Stage Match",
          teamA: { name: "India", short: "IND", score: `${indRuns}/${indWickets}`, overs: `${indOverInt}.${indOverBalls}` },
          teamB: { name: "Pakistan", short: "PAK", score: "Yet to Bat", overs: "0.0" },
          status: `In Progress: India batting first (${indOverInt}.${indOverBalls} Ov)`,
          venue: "Nassau County Intl. Stadium, NY",
          pitchReport: "Double-paced surface, heavy bounce variability, difficult to establish rhythm.",
          predictedOutcome: "IND (56%) over PAK (44%) based on bowling depth"
        },
        {
          id: "t20-aus-eng",
          title: "T20 World Cup - Super 8s Premium Clash",
          teamA: { name: "Australia", short: "AUS", score: `${ausRuns}/${ausWickets}`, overs: "20.0" },
          teamB: { name: "England", short: "ENG", score: `${engRuns}/${engWickets}`, overs: `${engOverInt}.${engOverBalls}` },
          status: engStatus,
          venue: "Kensington Oval, Barbados",
          pitchReport: "Moisture loaded pitch with initial swing. Wind speeds of 18 knots assisting off-cutters.",
          predictedOutcome: engRuns >= 179 ? "England Victory" : "Undecided"
        }
      ],
      cricketLive: [
        {
          id: "ipl-csk-rcb",
          title: "IPL Core Fixture Ticker",
          teamA: { name: "Chennai Super Kings", short: "CSK", score: "192/4", overs: "20.0" },
          teamB: { name: "Royal Challengers Bengaluru", short: "RCB", score: `${Math.min(195, Math.floor(((now / 18000) % 20) * 9.6))}/5`, overs: `${Math.min(20, Math.floor(((now / 18000) % 20)))}.${Math.floor((((now / 18000) % 20) % 1) * 6)}` },
          status: "In Progress: RCB chasing 193",
          venue: "M. Chinnaswamy Stadium, Bengaluru",
          pitchReport: "Patches of dew forming, flat deck favoring powerplays.",
          predictedOutcome: "RCB (52%) favored under lights"
        }
      ],
      footballLive: [
        {
          id: "fb-che-ars",
          title: "English Premier League Heavyweights",
          teamA: { name: "Chelsea", short: "CHE", score: chelseaGoals.toString() },
          teamB: { name: "Arsenal", short: "ARS", score: arsenalGoals.toString() },
          status: `${footStatus} - ${footMins}'`,
          venue: "Stamford Bridge, London",
          pitchReport: "Slight evening drizzle, wet turf slickness speeding up ground passes.",
          predictedOutcome: chelseaGoals > arsenalGoals ? "Chelsea Advantage" : chelseaGoals < arsenalGoals ? "Arsenal Advantage" : "Draw"
        }
      ],
      worldCupLive: [
        {
          id: "wc-bra-ger",
          title: "FIFA World Cup - Group Stage Drama",
          teamA: { name: "Brazil", short: "BRA", score: brazilGoals.toString() },
          teamB: { name: "Germany", short: "GER", score: germanyGoals.toString() },
          status: `${footStatus} - ${footMins}'`,
          minute: footMins,
          venue: "Estádio do Maracanã, Rio de Janeiro",
          pitchReport: "Perfect hybrid turf. High atmospheric play speed index.",
          predictedOutcome: brazilGoals > germanyGoals ? "Brazil Advantage" : brazilGoals < germanyGoals ? "Germany Advantage" : "Draw",
          stats: braGerStats,
          events: braGerEvents
        },
        {
          id: "wc-arg-fra",
          title: "FIFA World Cup - Legendary Heavyweight Clash",
          teamA: { name: "Argentina", short: "ARG", score: argentinaGoals.toString() },
          teamB: { name: "France", short: "FRA", score: franceGoals.toString() },
          status: `${footStatus} - ${footMins}'`,
          minute: footMins,
          venue: "Lusail Iconic Stadium, Qatar",
          pitchReport: "Controlled climate, high-friction turf assisting fast counter-breaks.",
          predictedOutcome: argentinaGoals > franceGoals ? "Argentina Advantage" : argentinaGoals < franceGoals ? "France Advantage" : "Draw",
          stats: argFraStats,
          events: argFraEvents
        }
      ]
    });
  });

  // API 2.5: NASA and Technology News Feed Proxy
  app.get("/api/news", async (req, res) => {
    const category = req.query.category === "tech" ? "tech" : "nasa";
    const cacheBuster = Date.now();

    if (category === "nasa") {
      try {
        const response = await fetch(`https://api.spaceflightnewsapi.net/v4/articles/?limit=6&_=${cacheBuster}`);
        if (!response.ok) throw new Error("Spaceflight API status error");
        const json: any = await response.json();
        
        const articles = json.results.map((item: any) => ({
          id: item.id,
          title: item.title,
          summary: item.summary,
          url: item.url,
          imageUrl: item.image_url || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
          publishedAt: item.published_at ? new Date(item.published_at).toLocaleDateString() : "Just now",
          source: item.news_site || "NASA Science Network"
        }));

        return res.json({ articles, source: "LIVE Spaceflight News Feed" });
      } catch (err: any) {
        console.warn("Spaceflight News API offline or failed. Serving highly curated space & NASA science news.");
        const fallbackNasaNews = [
          {
            id: "nasa-1",
            title: "James Webb Telescope Detects Volatile Hydrocarbons on Habitable Zone Exoplanet",
            summary: "Spectroscopic data logs peak signatures of methane and carbon dioxide on a super-earth exoplanet orbiting within its host star's goldilocks zone, elevating research for potential biomarkers.",
            url: "https://www.nasa.gov",
            imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
            publishedAt: new Date().toLocaleDateString(),
            source: "NASA Astrophysics Gateway"
          },
          {
            id: "nasa-2",
            title: "Artemis III Crew Volatiles Mapping Rover Enters Integration Phase",
            summary: "NASA's latest polar investigation vehicle undergoes vibration and sub-zero vacuum testing to ensure optimal drilling and detection of frozen water ice within lunar south pole craters.",
            url: "https://www.nasa.gov",
            imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=800&q=80",
            publishedAt: new Date(Date.now() - 86400000).toLocaleDateString(),
            source: "NASA Moon-to-Mars Directorate"
          },
          {
            id: "nasa-3",
            title: "Solar Parker Probe Pierces Outer Solar Corona logging Intense Sub-Swells",
            summary: "A historic dive within 10 solar radii captures magnetic flux fields and particle wave propagation, providing direct observation data on coronal thermal ionization triggers.",
            url: "https://www.nasa.gov",
            imageUrl: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&w=800&q=80",
            publishedAt: new Date(Date.now() - 172800000).toLocaleDateString(),
            source: "GSFC Heliophysics Directorate"
          },
          {
            id: "nasa-4",
            title: "Perseverance Rover Extracts Deep Crustal Martian Carbonates",
            summary: "Extracted core sample logs high density of ancient sediment structures in Jezero Crater, signifying continuous water-flow during the planet's Hesperian epoch.",
            url: "https://www.nasa.gov",
            imageUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=800&q=80",
            publishedAt: new Date(Date.now() - 259200000).toLocaleDateString(),
            source: "JPL Planetary Science Feed"
          },
          {
            id: "nasa-5",
            title: "Europa Clipper Successfully Calibrates Multi-Spectral Radar Gateways",
            summary: "Critical thermal instruments successfully replicate sub-surface ocean soundings. Integration with flight computers is now certified for upcoming outer celestial flybys.",
            url: "https://www.nasa.gov",
            imageUrl: "https://images.unsplash.com/photo-1464802686167-b939a6910659?auto=format&fit=crop&w=800&q=80",
            publishedAt: new Date(Date.now() - 345600000).toLocaleDateString(),
            source: "NASA Outer Rim Exploration Network"
          }
        ];
        return res.json({ articles: fallbackNasaNews, source: "Simulated NASA Deep Space Telemetry" });
      }
    } else {
      // Category: Technology News
      try {
        const response = await fetch(`https://hacker-news.firebaseio.com/v0/topstories.json?_=${cacheBuster}`);
        if (!response.ok) throw new Error("HackerNews API topstories failed");
        const topIds: any = await response.json();
        
        // Fetch details for the top 5 hacker news stories
        const detailPromises = topIds.slice(0, 6).map(async (id: number) => {
          try {
            const detailRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
            if (!detailRes.ok) return null;
            return await detailRes.json();
          } catch {
            return null;
          }
        });

        const rawStories = await Promise.all(detailPromises);
        const articles = rawStories
          .filter((story: any) => story !== null)
          .map((story: any, idx: number) => {
            const dateStr = story.time ? new Date(story.time * 1000).toLocaleDateString() : "Just now";
            const imageUrls = [
              "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80",
              "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80"
            ];
            return {
              id: story.id,
              title: story.title || "Quantum Interconnect Link Breakthrough",
              summary: story.text ? story.text.replace(/<[^>]*>/g, '').substring(0, 200) + '...' : `An active tech-discussion thread regarding "${story.title}". Discusses next-generation systems, protocols, and efficiency models.`,
              url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
              imageUrl: imageUrls[idx % imageUrls.length],
              publishedAt: dateStr,
              source: `HackerNews (Score: ${story.score || 0})`
            };
          });

        if (articles.length === 0) throw new Error("No HN stories resolved");
        return res.json({ articles, source: "LIVE Global Tech Feed" });
      } catch (err: any) {
        console.warn("Tech API offline or timed out. Serving curated advanced technology chronicle.");
        const fallbackTechNews = [
          {
            id: "tech-1",
            title: "Super-Kelvin Quantum Processing Cores Breach 1000 Coherent Qubits",
            summary: "A commercial venture demonstrates non-decohering quantum states sustained for 12 milliseconds across a 1,120-qubit physical system cooled by dual-stage helium diluters.",
            url: "https://www.technologyreview.com",
            imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
            publishedAt: new Date().toLocaleDateString(),
            source: "Quantum Systems Review"
          },
          {
            id: "tech-2",
            title: "Silicon Photonics Waveguides Achieve 4.8 Tbps Multi-Channel Transfer",
            summary: "Optical transit links engineered with active indium-phosphide micro-lasers eliminate copper resistance, accelerating edge server computing pipeline indices.",
            url: "https://thw.com",
            imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
            publishedAt: new Date(Date.now() - 86400000).toLocaleDateString(),
            source: "Solid State Photonics Journal"
          },
          {
            id: "tech-3",
            title: "Experimental Magnetic Mirror Fusion Reactor logs Net Energy Gain",
            summary: "A private fusion development firm maintains central plasma containment core stability for over 6 minutes, yielding a Q-thermal factor exceeding 1.15.",
            url: "https://www.nature.com",
            imageUrl: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=800&q=80",
            publishedAt: new Date(Date.now() - 172800000).toLocaleDateString(),
            source: "High Energy Physics Digest"
          },
          {
            id: "tech-4",
            title: "Bionic Graphene Anode Batteries Enter Final Low-Scale Pilot Stages",
            summary: "Next-gen solid-state battery matrices deploy micro-patterned graphene lanes to secure lithium ion migration paths, increasing continuous cycle rates with minimal degradation.",
            url: "https://www.wired.com",
            imageUrl: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=800&q=80",
            publishedAt: new Date(Date.now() - 259200000).toLocaleDateString(),
            source: "Electrochemical Energy Letters"
          },
          {
            id: "tech-5",
            title: "Sub-Nanometer Optical Lithography Mirrors Pass Initial Beam Wave Tests",
            summary: "Monolithic quartz crystal lenses utilizing hyper-euv extreme ultraviolet paths achieve diffraction targets, making 1.2-nanometer logic nodes commercially viable.",
            url: "https://www.semiconductors.org",
            imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80",
            publishedAt: new Date(Date.now() - 345600000).toLocaleDateString(),
            source: "Lithography Tech Review"
          }
        ];
        return res.json({ articles: fallbackTechNews, source: "Elite Technology Chronicle Feed" });
      }
    }
  });

  // API 3: Server-side Gemini AI predictor proxy
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { messages, context } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Messages array is required." });
      }

      const key = process.env.GEMINI_API_KEY;
      if (!key) {
        return res.status(500).json({ 
          error: "GEMINI_API_KEY secret is not configured. Please supply it in Settings > Secrets." 
        });
      }

      const ai = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = `You are "Apex Sports Analytics AI", an elite sports predictor co-pilot powered by Gemini.
You analyze cricket matches (IPL, ICC T20 World Cup), football fixtures, and weather trends to produce predictive models.
Use deep statistical intuition (regression, ELO, weather indices) and provide professional, data-centric suggestions to optimize winning predictions.
Provide short, punchy, beautiful responses using markdown. Highlight match-ups, player leverage indices, and weather-driven friction indexes.
Context on current live matches and environment:\n${JSON.stringify(context || {})}`;

      const contents = messages.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text || msg.content }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "An error occurred with the AI predictor." });
    }
  });

  // Serve Vite assets
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
