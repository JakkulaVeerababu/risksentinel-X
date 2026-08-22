class GraphRiskCalculator:
    # Deterministic configurable threshold
    GRAPH_SUSPICIOUS_THRESHOLD = 0.65
    
    @classmethod
    def calculate_risk(cls, signals: dict) -> float:
        """
        Calculates a deterministic risk score [0,1] based on extracted graph signals.
        """
        risk = 0.0
        
        # 1. Device sharing weight (High risk if a single device connects many accounts)
        # Normal behavior might share up to 2. Let's penalize heavily beyond 2.
        if signals["shared_device_count"] > 2:
            risk += min(0.4, (signals["shared_device_count"] - 2) * 0.1)
            
        # 2. IP sharing weight (Moderate risk, IPs can be legitimately shared e.g. households)
        if signals["shared_ip_count"] > 4:
            risk += min(0.3, (signals["shared_ip_count"] - 4) * 0.05)
            
        # 3. Payment instrument reuse (Very high risk if shared across multiple unrelated accounts)
        if signals["payment_instrument_reuse"] > 1:
            risk += min(0.5, (signals["payment_instrument_reuse"] - 1) * 0.2)
            
        # 4. Dense community penalty
        # High density in larger communities is a strong signal for synthetic cluster fraud
        if signals["community_size"] >= 4 and signals["community_density"] > 0.5:
            risk += 0.3 * signals["community_density"]
            
        # Bound between 0 and 1
        final_risk = float(max(0.0, min(1.0, risk)))
        return final_risk
