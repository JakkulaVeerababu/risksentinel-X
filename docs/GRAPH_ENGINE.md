# Graph Engine Runbook

## Purpose
The Graph Engine (NetworkX) detects suspicious linkages between entities that an isolated ML score might miss. Because IEEE-CIS lacks comprehensive relationship data, we use a labeled synthetic relationship benchmark to evaluate graph detection.

## Ground Truth Separation
> **CRITICAL:** The detector != the ground-truth evaluator. Ground truth labels are planted during synthetic generation but are NEVER read by the graph engine during scoring.

## Entity Types
The graph models the following implemented entities:
- customer
- device
- IP
- payment instrument
- transaction

## Graph Signals
The Louvain community detection algorithm projects the bipartite graph into communities. We calculate:
- `shared_device_count`: Number of distinct customers sharing a device.
- `shared_ip_count`: Number of distinct customers sharing an IP.
- `community_density`: Ratio of edges to potential edges within a Louvain community.

## Graph Risk Formula
The graph risk score (0.0 to 1.0) is a normalized weighted sum of the above signals.
*Note: This is a prototype graph risk score and is not a calibrated real-world probability.*
Threshold for triggering graph investigation: `Confidence > 0.70`
