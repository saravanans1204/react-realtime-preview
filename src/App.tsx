import { useState, useEffect } from 'react';
import './App.css';
import { RealtimePreview } from './Components/RealtimePreview';

const useStreamingText = () => {
  const [text, setText] = useState('');
  const fullText = `# Exploring the World of Technology

## Overview of Modern Innovations

Technology continues to shape our world in unprecedented ways. From artificial intelligence to renewable energy, innovations are driving progress across industries. This guide explores key areas of technological advancement.

### Artificial Intelligence

Artificial Intelligence (AI) is revolutionizing how we live and work. Its applications span multiple domains:

- Machine Learning
- Natural Language Processing
- Computer Vision
- Robotics

**Key Benefits:**
- Automates repetitive tasks
- Enhances decision-making
- Improves customer experiences

### Renewable Energy

The shift toward sustainable energy sources is critical for the future. Key technologies include:

- Solar Power
- Wind Energy
- Hydropower
- Geothermal Energy

> "Renewable energy is not just an option; it’s a necessity for a sustainable future." – Expert Opinion

#### Comparison of Renewable Energy Sources

| Energy Source  | Efficiency (%) | Cost (USD/kWh) | Availability       |
|----------------|---------------|----------------|--------------------|
| Solar Power    | 15-22         | 0.03-0.15      | Daytime, Sunny Areas |
| Wind Energy    | 35-50         | 0.02-0.10      | Windy Regions       |
| Hydropower     | 70-90         | 0.01-0.12      | Near Rivers/Lakes   |
| Geothermal     | 10-20         | 0.05-0.10      | Geothermal Hotspots |

### Global Tech Hubs

Several cities lead the way in technological innovation:

- **Silicon Valley, USA**: Home to tech giants like Google and Apple
- **Bangalore, India**: Known as the Silicon Valley of India
- **Shenzhen, China**: A hub for hardware and manufacturing
- **Berlin, Germany**: Emerging center for startups

#### Tech Hub Comparison

| City            | Key Industry         | Annual Growth (%) | Number of Startups |
|-----------------|----------------------|-------------------|--------------------|
| Silicon Valley  | Software/Tech        | 8.5               | 2,500              |
| Bangalore       | IT Services          | 7.2               | 1,800              |
| Shenzhen        | Electronics          | 9.0               | 1,200              |
| Berlin          | Software/Startups    | 6.8               | 1,000              |

### Future Trends

Looking ahead, technology will continue to evolve. Key trends include:

- Increased adoption of 5G networks
- Growth in quantum computing
- Expansion of Internet of Things (IoT)
- Focus on cybersecurity

> The next decade will redefine how we interact with technology daily.

**Stay Curious!** 🌐`;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.substring(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(interval);
      }
    }, 10);

    return () => clearInterval(interval);
  }, []);

  return text;
};

function App() {
  const streamingText = useStreamingText();

  return (
    <div>
      <RealtimePreview
        text={streamingText}
        mode="Turn"
        containerClassName="my-custom-container"
        pageClassName="my-custom-page"
      />
    </div>
  );
}

export default App;