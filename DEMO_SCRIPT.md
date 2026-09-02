# RiskSentinel X - 5-Minute Demo Script

A 5-minute video goes by *fast*. You need to hook the judges immediately, show off your beautiful UI, explain the problem, and prove that it works live. Here is the perfect structure for your Razorpay Hackathon submission.

---

## 0:00 - 1:00 | The Hook & The UI Showcase (60 seconds)
* **Visual:** Start on the beautiful RiskSentinel X Landing Page (top of the page).
* **Script:** "Hi, I'm [Your Name], and this is RiskSentinel X. The modern payment ecosystem faces a massive problem: fraud is getting faster, highly coordinated, and too complex for traditional rule-based systems to catch. We built RiskSentinel X to fix this: going from risk signal to final decision, in one workspace."
* **Visual:** Scroll down smoothly through the landing page sections.
* **Script:** "Our platform is built for the moment risk becomes real. We use a **4-Stage AI Pipeline**:
  1. We detect anomalies using ML models.
  2. We connect evidence using Graph intelligence to find hidden fraud rings.
  3. Our Gemini AI investigates the scattered signals and generates a human-readable recommendation.
  4. Finally, a deterministic Policy Engine makes the accountable decision."
* **Visual:** Scroll down to the "Core capabilities" cards, then scroll back up to the top. Click the blue **"Open risk workspace"** button to enter the Dashboard.

## 1:00 - 1:45 | The Dashboard Architecture (45 seconds)
* **Visual:** You are now on the live Dashboard. Show the metric distribution and the Policy Engine Coverage.
* **Script:** "Welcome to the live workspace. Every transaction flows through our 4 stages in under 2 seconds. Analysts are no longer drowning in noise; they get clear, prioritized intelligence."

## 1:45 - 3:00 | Live Demo - The Legitimate Transaction (75 seconds)
* **Visual:** Open a split screen or quickly switch to your terminal/API tester. Hit the live Render API with the *Legitimate* transaction payload from the Testing Guide.
* **Script:** "Let's see it live. I'm going to send a legitimate, everyday transaction to our production API." 
* **Visual:** Hit enter, switch back to the Dashboard. Click on the new transaction that just popped up.
* **Script:** "Instantly, it appears on our dashboard. Because the ML risk was low and the Graph AI detected no connected fraud rings, the Gemini Agent verified the footprint and the Policy Engine confidently **ALLOWED** the transaction. Zero friction for good users."

## 3:00 - 4:30 | Live Demo - The Fraud Ring Attack (90 seconds)
* **Visual:** Switch back to the terminal. Run the *High-Risk Fraudulent* transaction.
* **Script:** "Now, let's simulate an organized attack. A user tries to process a high-value transaction using an anonymous email and a shared VPN IP address."
* **Visual:** Hit enter, switch back to the Dashboard. Click the red BLOCKED/REVIEWED transaction. 
* **Visual:** *Crucial Step:* Open the **Investigation AI Case** tab for this transaction. Show the Gemini Agent's output.
* **Script:** "Our pipeline intercepted it immediately. The ML flagged the high amount, but more importantly, the Graph AI detected the shared VPN footprint. But the best part is right here: our **Gemini AI Agent** investigated the signals and generated a human-readable explanation of exactly *why* this transaction is dangerous. No more black-box AI; fraud teams get a complete, understandable report instantly."

## 4:30 - 5:00 | The Business Impact & Closing (30 seconds)
* **Visual:** Show the "Export CSV" feature or just rest on the beautiful dashboard metrics.
* **Script:** "RiskSentinel X is built to scale. It's deployed live on Vercel and Render, backed by Supabase. By combining predictive ML, graph relationships, and Generative AI, we drastically reduce false positives and block coordinated fraud before the money moves. Thank you."

---

### Pro-Tips for Recording
1. **Use Loom or OBS Studio:** Loom is amazing because it puts your webcam in a small circle in the corner while you share your screen.
2. **Be Energetic:** You built something highly complex. Sound excited about it!
3. **Don't Worry About Stuttering:** If you mess up a word, just keep going. Authenticity is better than a robotic, over-edited video.
4. **Practice the API hits:** Have your two PowerShell/cURL commands already typed out in two separate windows so you can just press Enter during the recording.
