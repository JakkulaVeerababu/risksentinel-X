class GraphRiskCalculator:
    # Deterministic configurable threshold
    GRAPH_SUSPICIOUS_THRESHOLD = 0.30
    
    @classmethod
    def calculate_risk(cls, signals: dict) -> float:
        """
        Calculates a deterministic risk score [0,1] based on extracted graph signals.
        """
        risk = 0.0
        
        # 1. Device sharing weight
        if signals["shared_device_count"] > 2:
            risk += (signals["shared_device_count"] - 2) * 0.1
            
        # 2. IP sharing weight
        if signals["shared_ip_count"] > 4:
            risk += (signals["shared_ip_count"] - 4) * 0.1
            
        # 3. Payment instrument reuse
        if signals["payment_instrument_reuse"] > 1:
            risk += (signals["payment_instrument_reuse"] - 1) * 0.2
            
        # 4. Dense community penalty
        if signals["community_size"] >= 4 and signals["community_density"] > 0.05:
            risk += 0.4 * signals["community_density"]
            
        # Bound between 0 and 1
        final_risk = float(max(0.0, min(1.0, risk)))
        return final_risk
