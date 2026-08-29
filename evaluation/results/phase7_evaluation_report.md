# RiskSentinel X — Phase 7 Final Verified Evaluation

ML HELD-OUT:

Rows:
88581

AP:
0.4810

Precision:
0.4535

Recall:
0.4635

F1:
0.4585

TP:
1429

FP:
1722

TN:
83776

FN:
1654

Threshold:
0.80

Post-heldout tuning:
NO

Graph:

Dataset:
Synthetic seeded graph benchmark

TP:
113
FP:
12
TN:
2988
FN:
1

Precision:
0.9040

Recall:
0.9912

F1:
0.9456

Historical reproducibility:
FAIL

Historical difference reason:
Historical Phase-2B metrics could not be exactly reproduced from the current repository state. The current frozen evaluator produced the above results.

Runtime graph label leakage:
NOT FOUND

Agent controlled cases:
30

Real Ollama attempted:
10

Real Ollama structured valid:
10/10

Real Ollama degraded:
0/10

Controlled prompt injection:
3/3

Max tool calls:
2

Max provider calls:
1

Gate:

Controlled cases:
100

Skipped:
96

Invoked:
4

Calls avoided:
96/100 CONTROLLED SYNTHETIC BATCH

Policy:

Runs:
700

Deterministic:
700/700

BLOCK .99 weak:
REVIEW

ALLOW .99 strong:
BLOCK

Failures:

Unsafe silent ALLOW:
0/5

Audit:
10/10

Idempotency:

Requests:
111
Contradictions:
0

Latency:

LOCAL DEVELOPMENT BENCHMARK

Hardware:
CPU: AMD64 Family 25 Model 68 Stepping 1, AuthenticAMD
GPU: NVIDIA GeForce RTX 4050 Laptop GPU
RAM: 24GB
OS: Windows 11

Skip path:
n: 20
mean: 189.68 ms
median: 163.30 ms
p95: 263.89 ms

Ollama provider:
n: 10
mean: 7233.57 ms
median: 6873.91 ms
p95: 8192.28 ms

Canonical Ollama E2E:
n: 5
mean: 5743.47 ms
median: 5719.52 ms
p95: 5845.05 ms

Backend:
PASS

Frontend:
PASS

No hardcoded metrics:
PASS

PHASE 7 CLEANLY VERIFIED — READY FOR PHASE 8
