import json
from pathlib import Path
import logging

class PolicyConfig:
    _instance = None
    
    def __init__(self):
        self.policy_version = "policy-v1"
        self.ml_low_threshold = 0.15
        self.ml_high_threshold = 0.85
        self.graph_high_threshold = 0.80
        self.min_block_evidence_count = 2
        self.load_from_file()
        
    def load_from_file(self):
        # Look for the generated selection file from Phase 4
        config_path = Path(__file__).parent.parent.parent.parent / "evaluation" / "policy_threshold_selection.json"
        
        if config_path.exists():
            try:
                with open(config_path, "r") as f:
                    data = json.load(f)
                    self.policy_version = data.get("policy_version", self.policy_version)
                    self.ml_low_threshold = data.get("low_threshold", self.ml_low_threshold)
                    self.ml_high_threshold = data.get("high_threshold", self.ml_high_threshold)
                    self.graph_high_threshold = data.get("graph_high_threshold", self.graph_high_threshold)
                    self.min_block_evidence_count = data.get("min_block_evidence_count", self.min_block_evidence_count)
                logging.info(f"Loaded Policy Config {self.policy_version}: LOW={self.ml_low_threshold}, HIGH={self.ml_high_threshold}")
            except Exception as e:
                logging.error(f"Failed to load policy config: {e}. Using defaults.")
        else:
            logging.warning("No policy_threshold_selection.json found. Using default thresholds.")
            
    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = PolicyConfig()
        return cls._instance
