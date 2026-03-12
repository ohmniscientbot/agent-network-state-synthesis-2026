# Architectural Decision Records

This document captures important design decisions made during the development of the Agent Network State Protocol, including rationale and alternatives considered.

---

## Decision 001: Removal of Unverified Vitalik Governance References

**Date:** March 12, 2026  
**Status:** Accepted  
**Context:** [Issue #404 - Broken link to Vitalik governance article]

### Problem

The codebase contained several references to "Vitalik-inspired governance filtering via market mechanisms" with links that returned 404 errors. These references appeared in:

- Prediction market implementation comments
- API documentation 
- Dashboard metrics descriptions

### Investigation

We conducted extensive research to find the source material:

**Search Results:**
- ✅ Found recent news reports (Feb 2026) about Vitalik discussing two-layer governance with prediction markets
- ✅ Found related blog posts on governance mechanisms ("Moving beyond coin voting governance", "Coordination, Good and Bad")
- ❌ Could not locate specific source for "governance filtering via market mechanisms"
- ❌ No direct blog post matching the exact concepts referenced

**Sources Examined:**
- vitalik.eth.limo (complete blog archive)
- Recent crypto governance news (Financial Magnates, BingX, The Block)
- Academic papers on prediction market governance
- Ethereum governance forum discussions

### Decision

**Removed all "Vitalik-inspired" references** from the codebase.

**Rationale:**
1. **Accuracy over Authority:** We cannot make claims about someone's ideas without proper attribution
2. **Academic Integrity:** Hackathon projects should model good research practices
3. **Credibility:** Unverified claims undermine the project's technical credibility
4. **Legal:** Misattribution could create unnecessary issues

### Alternatives Considered

1. **Replace with verified Vitalik quotes** - Would require finding exact source material
2. **Use generic "prediction market governance" references** - Chosen approach, maintains concept without false attribution
3. **Replace with other governance thought leaders** - Would face same attribution challenges

### Implementation

- Removed "Vitalik-inspired" from all comment blocks
- Maintained prediction market functionality (the code works regardless of attribution)
- Updated k8s configmaps and redeployed
- Created research TODO for future improvement cycles

### Future Work

The autonomous improvement system will:
- Research current prediction market governance literature
- Compile proper citations for governance mechanisms
- Recommend whether to add back references with verified sources
- Explore alternative governance frameworks

### Learning

This demonstrates the importance of:
- Verifying claims before publication
- Proper academic citation practices in code
- The difference between being "inspired by" vs. "implementing someone's specific idea"
- Maintaining code integrity even under tight deadlines

---

**Related Files:**
- `api/server.js` (prediction market implementation)
- `research-todo.md` (future research tasks)
- Git commit: `54349b0` (removal of references)

**Contributors:** @redondos, @ohmniscient