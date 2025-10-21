import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { RealtimePreview } from './Components/RealtimePreview'

const useStreamingText = () => {
  const [text, setText] = useState('');
  const fullText = "Back Mechanic: The Step-by-Step McGill Method to Fix Back Pain is a landmark self-help book by Dr. Stuart McGill, one of the world's leading spine biomechanics researchers and clinicians. Published in 2015, this book distills decades of research and clinical experience into a practical guide for people suffering from chronic back pain.About Dr. Stuart McGillDr. McGill is Professor Emeritus of Spine Biomechanics at the University of Waterloo in Canada. He spent over 30 years researching spine function, injury mechanisms, and rehabilitation. His laboratory has been recognized internationally for understanding how the spine works, what causes injury, and how to restore pain-free function. He's worked with elite athletes, military personnel, and everyday people suffering from debilitating back pain.Core PhilosophyThe book's fundamental premise challenges conventional wisdom about back pain. McGill argues that most back pain is mechanical in nature - meaning it's caused by how we move, load, and use our spines throughout daily activities. Rather than viewing back pain as a mysterious condition requiring surgery or medication, he presents it as a solvable mechanical problem that can be addressed through assessment, understanding pain triggers, and strategic rehabilitation.Key ConceptsPain Triggers and Mechanisms: McGill emphasizes that each person's back pain has specific mechanical triggers. What causes pain for one person (like sitting) might be fine for another whose pain comes from bending or twisting. The book teaches readers to identify their personal pain triggers through systematic self-assessment.The Virtual Surgery Approach: Instead of actual surgery, McGill advocates for virtual surgery - removing pain triggers from your life while building resilience. This means avoiding movements and postures that provoke pain while the tissues heal, then gradually reintroducing activities with proper mechanics.Spine Hygiene: The concept of spine hygiene is central to the book. This involves learning proper movement patterns for daily activities - how to sit, stand, bend, lift, and twist in ways that protect rather than damage the spine. McGill provides specific guidance on modifying common activities like getting out of bed, sitting at a desk, and lifting objects.Individual Variability: McGill stresses that there";

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
  const [count, setCount] = useState(0)
  const streamingText = useStreamingText();

  return (
    
      <div>
      <RealtimePreview
        text={streamingText}
        charsPerPage={900}
        mode="scroll"
        containerClassName="my-custom-container"
        pageClassName="my-custom-page"
      />
    </div>

  )
}



export default App
