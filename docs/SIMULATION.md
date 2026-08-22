# Simulation Runbook

## Purpose
The Simulation module generates defensive synthetic test scenarios to demonstrate system capabilities (especially Graph linkages) during the MVP demo.

## Endpoint & Execution
Triggered via the Dashboard button or manually via:
```http
POST /api/v1/evaluation/simulate
```

## Behavior
The simulation generates 5-6 interconnected synthetic transactions (sharing devices/IPs). It updates the relationships in NetworkX and pushes events through the REAL ML scoring service, REAL agent, and REAL policy engine, streaming outputs to the dashboard.

## Defense-Only Statement
> The simulation creates synthetic suspicious patterns solely for defensive detection and investigation testing.

## Simulation Does Not Force Results
The generator creates *inputs*, but the real services produce the *outputs*. There are no hardcoded ML scores, graph risks, or final decisions. The system reacts organically to the injected data.
