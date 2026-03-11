#!/usr/bin/env python3
"""
Improvement Summary Generator
============================
Provides concise summary of all autonomous improvements made to the project
"""

import json
import sys
from pathlib import Path
from datetime import datetime

def get_improvement_summary():
    """Generate concise summary of all improvements"""
    
    project_root = Path(__file__).parent
    changelog_path = project_root / "improvements" / "changelog.json"
    
    if not changelog_path.exists():
        return "No improvements recorded yet."
    
    try:
        with open(changelog_path, 'r') as f:
            changelog = json.load(f)
    except:
        return "Error reading improvement changelog."
    
    if not changelog:
        return "No improvement cycles completed."
    
    # Generate summary statistics
    total_cycles = len(changelog)
    total_implementations = sum(len(cycle.get("implementations", [])) for cycle in changelog)
    successful_implementations = sum(
        len([impl for impl in cycle.get("implementations", []) if impl.get("result", {}).get("success")])
        for cycle in changelog
    )
    
    # Get recent cycles (last 5)
    recent_cycles = changelog[-5:] if len(changelog) > 5 else changelog
    
    # Collect all improvements
    all_improvements = []
    for cycle in changelog:
        for impl in cycle.get("implementations", []):
            if impl.get("result", {}).get("success"):
                all_improvements.append({
                    "improvement": impl["improvement"],
                    "timestamp": impl["timestamp"],
                    "cycle": cycle["cycle_id"]
                })
    
    # Generate summary
    summary = f"""
🤖 AUTONOMOUS IMPROVEMENT SYSTEM SUMMARY
=====================================

📊 STATISTICS
- Total improvement cycles: {total_cycles}
- Total implementations attempted: {total_implementations}
- Successful implementations: {successful_implementations}
- Success rate: {(successful_implementations/total_implementations*100) if total_implementations > 0 else 0:.1f}%

✅ KEY IMPROVEMENTS IMPLEMENTED
"""
    
    if all_improvements:
        for i, improvement in enumerate(all_improvements[-10:], 1):  # Last 10 improvements
            timestamp = datetime.fromisoformat(improvement["timestamp"].replace('Z', '+00:00'))
            summary += f"{i:2}. {improvement['improvement']}\n"
            summary += f"    └─ {timestamp.strftime('%Y-%m-%d %H:%M')} (Cycle: {improvement['cycle']})\n"
    else:
        summary += "None yet - system is initializing\n"
    
    summary += f"""
🔄 RECENT ACTIVITY
"""
    
    for cycle in recent_cycles:
        timestamp = datetime.fromisoformat(cycle["timestamp"].replace('Z', '+00:00'))
        summary += f"\n📅 {timestamp.strftime('%Y-%m-%d %H:%M')} - {cycle['cycle_id']}\n"
        
        summary_stats = cycle.get("summary", {})
        summary += f"   • Research queries: {summary_stats.get('research_queries', 0)}\n"
        summary += f"   • Gaps identified: {summary_stats.get('gaps_identified', 0)}\n"
        summary += f"   • Ideas generated: {summary_stats.get('ideas_generated', 0)}\n"
        summary += f"   • Implementations: {summary_stats.get('implementations_successful', 0)}/{summary_stats.get('implementations_attempted', 0)}\n"
        
        key_improvements = summary_stats.get("key_improvements", [])
        if key_improvements:
            summary += f"   • Key improvements: {', '.join(key_improvements)}\n"
    
    summary += f"""
🎯 SYSTEM STATUS
- Runs every 30 minutes automatically
- Next cycle: Check cron job status
- Research sources: GitHub, Reddit, forums, blogs, papers
- Implementation focus: High-impact, quick-to-implement features

📁 DOCUMENTATION
- improvements/changelog.json - Complete history
- improvements/improvement_cycle_*.md - Detailed cycle docs
- improvements/research-ideas.md - Ongoing research findings

🔧 MANUAL CONTROL
- Run ./trigger-improvement.sh for manual cycle
- Check improvements/ directory for detailed logs
"""
    
    return summary

if __name__ == "__main__":
    print(get_improvement_summary())