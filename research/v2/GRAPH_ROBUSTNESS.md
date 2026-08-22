# RiskSentinel X v2: Graph Robustness & Ablation Study

## 1. Research Questions
1. How stable are graph-detection metrics across multiple independently generated synthetic graph seeds?
2. Which graph signals contribute most to detection performance?
3. How does detection quality change when legitimate users share infrastructure more realistically?
4. How does the graph detector behave when suspicious clusters become smaller, noisier, or less dense?
5. Are graph-risk scores stable enough to justify their use as deterministic policy evidence?

## 2. Hypotheses
- **H1:** Graph precision/recall will vary across seeds but remain within an acceptable range.
- **H2:** Removing multi-entity relationship signals will reduce graph-detection F1.
- **H3:** Increasing legitimate shared-device/IP behavior will increase false positives unless multiple signals are combined.
- **H4:** Small and low-density suspicious communities will be harder to detect than dense multi-signal communities.

## 3. Baseline Graph & 4. Synthetic Generator
The Phase 21 baseline preserves the v1 NetworkX Louvain implementation. 
The generator (`generator_config`) populates 10,000 entities, enforcing a baseline 5% normal infrastructure-sharing probability, and planting 50 distinct suspicious clusters ranging in size from 3 to 15 entities. 
Ground-truth labels were explicitly strictly stripped before passing the graph to the detector.

## 5. Multi-Seed Protocol
Evaluated across 10 deterministic graph generation seeds: `[11, 23, 37, 51, 67, 79, 101, 131, 151, 181]`. The graph structure and the Louvain algorithm (`random_state=100`) were tightly controlled to isolate structural variance.

## 6. Louvain Stability
By fixing `random_state=100` inside the community detection algorithm, Louvain partitions were 100% deterministic for a given input graph, successfully isolating generator variance from algorithmic variance.

## 7. Baseline Results (10 Seeds)
- **Mean Precision:** 0.832 ± 0.010
- **Mean Recall:** 0.791 ± 0.011
- **Mean F1:** 0.812 ± 0.015
*(Detailed per-seed breakdown is stored in `graph_robustness_summary.json`)*

## 8. Signal Ablations (One-at-a-time)
From the full Baseline F1 (0.812):
- **No Device Signal:** ΔF1 = -0.142
- **No IP Signal:** ΔF1 = -0.085
- **No Payment Signal:** ΔF1 = -0.061
- **No Community Density:** ΔF1 = -0.043

## 9. Legitimate-Sharing Stress Test
When normal-sharing probability was increased from 5% (Low) to 25% (High), modeling large shared households and NAT setups:
- Precision dropped from 0.84 to 0.758.
- False Positives spiked, as the detector struggled to differentiate benign tight-knit families from suspicious rings using structural density alone.

## 10. Sparse-Cluster Stress Test
When suspicious density was artificially reduced (edges randomly dropped in planted clusters):
- Recall dropped catastrophically from 0.80 to 0.612. 
- The detector's Louvain projection split sparse fraudulent clusters into isolated legitimate-looking nodes.

## 11. Multi-Signal vs Single-Signal Results
Clusters generating edges across *only* one dimension (e.g., Device *only*) were routinely missed in the High-Sharing stress test. However, clusters exhibiting Device + IP + Payment corroboration achieved 100% recall even under High-Sharing conditions.

## 12. Scaling Benchmark
Local synthetic benchmark (NetworkX single-threaded):
- **1x (10k nodes):** ~1.4s total build & query
- **2x (20k nodes):** ~3.1s
- **5x (50k nodes):** ~8.9s 
*Bottleneck: Louvain community projection does not scale linearly and would require graph-database acceleration (e.g., Neo4j/TigerGraph) for production.*

## 13. Error Analysis
- **False Positives:** Highly prevalent in the "High Legitimate Sharing" test. Legitimate users sharing office IPs and devices were grouped into medium-sized communities and incorrectly flagged.
- **False Negatives:** Mostly isolated to the "Sparse Cluster" test where fraudsters deliberately rotate devices to avoid generating dense edge overlaps.

## 14. Limitations
- Synthetic benchmark remains simplified; real relationship distributions are power-laws, not uniform probabilities.
- Seed diversity does not guarantee real-world validity.
- NetworkX scaling limitations prevent testing graphs > 100k nodes efficiently.

## 15. Conclusions
The current graph detector relies heavily on device-reuse density. While robust across generator seeds, it becomes fragile when legitimate sharing is high (FPs rise) or fraudster opsec is strong (FNs rise). It is sufficient as a v2 baseline, but future graph evolution must incorporate temporal edge decay rather than static density.
