// AI Governance Analysis System
// Implements proposal summarization, risk analysis, and security monitoring
// Research source: Vitalik Buterin AI-driven frameworks, MakerDAO/Arbitrum patterns

const crypto = require('crypto');

// Proposal Analysis Engine
class GovernanceAI {
    constructor() {
        this.riskPatterns = [
            { pattern: /treasury|fund|budget|finance/i, type: 'financial_risk', weight: 0.8 },
            { pattern: /emergency|halt|stop|disable/i, type: 'operational_risk', weight: 0.9 },
            { pattern: /admin|owner|control|permission/i, type: 'security_risk', weight: 0.7 },
            { pattern: /constitution|fundamental|governance/i, type: 'constitutional_risk', weight: 0.8 },
            { pattern: /urgent|immediate|critical/i, type: 'urgency_indicator', weight: 0.6 }
        ];

        this.qualityIndicators = [
            { pattern: /\b\d+%|\$\d+|\d+\s*(eth|tokens?)\b/i, points: 2, reason: 'Contains specific metrics' },
            { pattern: /timeline|deadline|schedule/i, points: 1, reason: 'Includes implementation timeline' },
            { pattern: /impact|effect|consequence/i, points: 1, reason: 'Discusses potential impact' },
            { pattern: /rationale|reason|because|justification/i, points: 2, reason: 'Provides clear reasoning' },
            { pattern: /reference|link|source|study/i, points: 1, reason: 'Includes supporting references' }
        ];

        this.sentimentKeywords = {
            positive: ['improve', 'enhance', 'benefit', 'optimize', 'growth', 'innovation', 'efficiency'],
            negative: ['risk', 'problem', 'issue', 'concern', 'danger', 'threat', 'vulnerability'],
            neutral: ['proposal', 'suggest', 'consider', 'discuss', 'review', 'evaluate', 'analyze']
        };
    }

    // Main analysis function - combines multiple AI techniques
    analyzeProposal(proposal) {
        const text = `${proposal.title} ${proposal.description}`.toLowerCase();
        
        return {
            id: proposal.id,
            title: proposal.title,
            summary: this.generateSummary(proposal),
            riskAnalysis: this.performRiskAnalysis(text, proposal),
            qualityScore: this.calculateQualityScore(text),
            sentimentAnalysis: this.analyzeSentiment(text),
            recommendations: this.generateRecommendations(proposal),
            securityFlags: this.detectSecurityFlags(text),
            aiConfidence: this.calculateAIConfidence(text),
            analysisTimestamp: new Date().toISOString(),
            version: '1.0.0'
        };
    }

    // AI-powered proposal summarization (inspired by MakerDAO implementation)
    generateSummary(proposal) {
        const text = proposal.description;
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
        
        // Extract key sentences based on importance scoring
        const keyPhrases = [
            'proposes to', 'aims to', 'will result in', 'requests', 'suggests',
            'impact', 'benefit', 'cost', 'timeline', 'implementation'
        ];

        const scoredSentences = sentences.map(sentence => {
            let score = 0;
            const lowerSentence = sentence.toLowerCase();
            
            // Score based on key phrases
            keyPhrases.forEach(phrase => {
                if (lowerSentence.includes(phrase)) score += 2;
            });
            
            // Score based on length (optimal range 20-100 chars)
            if (sentence.length >= 20 && sentence.length <= 100) score += 1;
            
            // Score based on position (first and last sentences more important)
            const index = sentences.indexOf(sentence);
            if (index === 0 || index === sentences.length - 1) score += 1;
            
            return { sentence: sentence.trim(), score };
        });

        // Select top 2-3 sentences for summary
        const topSentences = scoredSentences
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map(s => s.sentence)
            .join('. ');

        return {
            brief: this.extractKeyAction(proposal),
            detailed: topSentences,
            keyMetrics: this.extractMetrics(text),
            estimatedReadTime: Math.ceil(text.length / 250) + ' minutes'
        };
    }

    // Extract the main action/objective
    extractKeyAction(proposal) {
        const text = proposal.title.toLowerCase();
        
        if (text.includes('upgrade') || text.includes('update')) {
            return `🔧 System upgrade: ${proposal.title}`;
        } else if (text.includes('fund') || text.includes('budget') || text.includes('treasury')) {
            return `💰 Financial proposal: ${proposal.title}`;
        } else if (text.includes('security') || text.includes('audit')) {
            return `🔐 Security measure: ${proposal.title}`;
        } else if (text.includes('governance') || text.includes('voting')) {
            return `⚖️ Governance change: ${proposal.title}`;
        } else {
            return `📝 General proposal: ${proposal.title}`;
        }
    }

    // Extract numerical metrics and data points
    extractMetrics(text) {
        const metrics = [];
        
        // Extract percentages
        const percentages = text.match(/\d+\.?\d*%/g);
        if (percentages) metrics.push(...percentages.map(p => `${p} mentioned`));
        
        // Extract monetary amounts
        const amounts = text.match(/\$\d+(?:,\d+)*(?:\.\d+)?|\d+\s*eth|\d+\s*tokens?/gi);
        if (amounts) metrics.push(...amounts.map(a => `${a} involved`));
        
        // Extract timeframes
        const timeframes = text.match(/\d+\s*(days?|weeks?|months?|years?)/gi);
        if (timeframes) metrics.push(...timeframes.map(t => `${t} timeline`));
        
        return metrics.slice(0, 5); // Limit to 5 key metrics
    }

    // Risk analysis using pattern matching and ML-inspired scoring
    performRiskAnalysis(text, proposal) {
        const risks = [];
        let totalRiskScore = 0;

        this.riskPatterns.forEach(({ pattern, type, weight }) => {
            if (pattern.test(text)) {
                risks.push({
                    type,
                    severity: weight > 0.8 ? 'high' : weight > 0.6 ? 'medium' : 'low',
                    description: this.getRiskDescription(type),
                    confidence: weight
                });
                totalRiskScore += weight;
            }
        });

        // Additional contextual risk analysis
        const wordCount = text.split(/\s+/).length;
        if (wordCount < 50) {
            risks.push({
                type: 'insufficient_detail',
                severity: 'medium',
                description: 'Proposal lacks sufficient detail for informed decision-making',
                confidence: 0.7
            });
        }

        // Check for unusual proposer behavior
        if (proposal.proposerId && proposal.proposerId.includes('demo')) {
            // This is demo data, skip behavioral analysis
        } else {
            // In real implementation, check proposer history
        }

        return {
            overallRisk: this.calculateOverallRisk(totalRiskScore),
            identifiedRisks: risks,
            riskScore: Math.min(totalRiskScore, 1.0),
            recommendation: totalRiskScore > 0.7 ? 'Recommend human review' : 'Standard governance process'
        };
    }

    getRiskDescription(type) {
        const descriptions = {
            financial_risk: 'Involves treasury funds or financial operations',
            operational_risk: 'Could affect system operations or availability',
            security_risk: 'Relates to access controls or system security',
            constitutional_risk: 'Proposes fundamental governance changes',
            urgency_indicator: 'Marked as urgent or time-sensitive'
        };
        return descriptions[type] || 'Unspecified risk category';
    }

    calculateOverallRisk(score) {
        if (score >= 0.8) return 'HIGH';
        if (score >= 0.5) return 'MEDIUM';
        if (score >= 0.2) return 'LOW';
        return 'MINIMAL';
    }

    // Quality scoring based on content analysis
    calculateQualityScore(text) {
        let score = 0;
        const breakdown = [];

        this.qualityIndicators.forEach(({ pattern, points, reason }) => {
            if (pattern.test(text)) {
                score += points;
                breakdown.push(reason);
            }
        });

        // Word count bonus (optimal range)
        const wordCount = text.split(/\s+/).length;
        if (wordCount >= 100 && wordCount <= 500) {
            score += 2;
            breakdown.push('Appropriate length');
        } else if (wordCount < 50) {
            score -= 1;
            breakdown.push('Too brief');
        } else if (wordCount > 1000) {
            score -= 1;
            breakdown.push('Too verbose');
        }

        return {
            score: Math.max(0, Math.min(10, score)),
            grade: this.scoreToGrade(score),
            breakdown,
            maxScore: 10
        };
    }

    scoreToGrade(score) {
        if (score >= 8) return 'A';
        if (score >= 6) return 'B';
        if (score >= 4) return 'C';
        if (score >= 2) return 'D';
        return 'F';
    }

    // Sentiment analysis for community response prediction
    analyzeSentiment(text) {
        let positiveScore = 0;
        let negativeScore = 0;
        let neutralScore = 0;

        this.sentimentKeywords.positive.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            const matches = (text.match(regex) || []).length;
            positiveScore += matches;
        });

        this.sentimentKeywords.negative.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            const matches = (text.match(regex) || []).length;
            negativeScore += matches;
        });

        this.sentimentKeywords.neutral.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            const matches = (text.match(regex) || []).length;
            neutralScore += matches;
        });

        const total = positiveScore + negativeScore + neutralScore;
        if (total === 0) return { sentiment: 'neutral', confidence: 0.5, scores: { positive: 0, negative: 0, neutral: 1 }};

        const sentiment = positiveScore > negativeScore ? 'positive' : 
                         negativeScore > positiveScore ? 'negative' : 'neutral';

        return {
            sentiment,
            confidence: Math.max(positiveScore, negativeScore) / total,
            scores: {
                positive: positiveScore / total,
                negative: negativeScore / total,
                neutral: neutralScore / total
            },
            predictedCommunityResponse: this.predictCommunityResponse(sentiment, positiveScore, negativeScore)
        };
    }

    predictCommunityResponse(sentiment, positive, negative) {
        if (sentiment === 'positive' && positive >= 3) {
            return 'Likely to receive strong community support';
        } else if (sentiment === 'negative' && negative >= 3) {
            return 'May face significant community opposition';
        } else if (positive > 0 && negative > 0) {
            return 'Mixed reception expected, thorough discussion recommended';
        } else {
            return 'Neutral reception expected';
        }
    }

    // Generate AI recommendations for governance
    generateRecommendations(proposal) {
        const recommendations = [];
        const text = `${proposal.title} ${proposal.description}`.toLowerCase();
        
        // Timeline recommendations
        if (!text.includes('timeline') && !text.includes('deadline')) {
            recommendations.push({
                type: 'improvement',
                priority: 'medium',
                suggestion: 'Consider adding implementation timeline',
                rationale: 'Clear timelines improve proposal evaluation and execution'
            });
        }

        // Budget/cost recommendations
        if ((text.includes('fund') || text.includes('budget')) && !text.match(/\$\d+|\d+\s*eth/)) {
            recommendations.push({
                type: 'improvement',
                priority: 'high',
                suggestion: 'Specify exact costs and funding requirements',
                rationale: 'Financial proposals require precise monetary details'
            });
        }

        // Risk mitigation
        if (text.includes('risk') || text.includes('security')) {
            recommendations.push({
                type: 'process',
                priority: 'high',
                suggestion: 'Recommend security audit before implementation',
                rationale: 'Risk-related proposals benefit from third-party validation'
            });
        }

        // Community engagement
        const wordCount = text.split(/\s+/).length;
        if (wordCount > 300) {
            recommendations.push({
                type: 'communication',
                priority: 'low',
                suggestion: 'Consider creating executive summary',
                rationale: 'Long proposals may benefit from brief summary for quick review'
            });
        }

        return recommendations;
    }

    // Security flag detection for malicious proposals
    detectSecurityFlags(text) {
        const flags = [];
        
        const maliciousPatterns = [
            { pattern: /backdoor|exploit|vulnerability|hack/i, flag: 'potential_malicious_intent' },
            { pattern: /drain|steal|siphon|extract.*all/i, flag: 'suspicious_financial_language' },
            { pattern: /bypass|override|disable.*security/i, flag: 'security_bypass_attempt' },
            { pattern: /emergency.*transfer|immediate.*access/i, flag: 'urgency_manipulation' }
        ];

        maliciousPatterns.forEach(({ pattern, flag }) => {
            if (pattern.test(text)) {
                flags.push({
                    flag,
                    severity: 'high',
                    description: 'Potentially malicious language detected',
                    recommendation: 'Manual security review recommended'
                });
            }
        });

        // Detect unusual patterns
        if (text.length < 20) {
            flags.push({
                flag: 'insufficient_content',
                severity: 'medium',
                description: 'Proposal unusually short, may lack legitimacy',
                recommendation: 'Request additional details'
            });
        }

        return flags;
    }

    // Calculate AI confidence score for analysis accuracy
    calculateAIConfidence(text) {
        let confidence = 0.5; // Base confidence
        
        const wordCount = text.split(/\s+/).length;
        
        // Higher confidence for appropriate length
        if (wordCount >= 50 && wordCount <= 500) {
            confidence += 0.3;
        } else {
            confidence -= 0.1;
        }
        
        // Higher confidence if structured content detected
        if (text.includes(':') || text.includes('1.') || text.includes('-')) {
            confidence += 0.2;
        }
        
        return Math.max(0.2, Math.min(0.95, confidence));
    }

    // Batch analysis for multiple proposals
    batchAnalyzeProposals(proposals) {
        return proposals.map(proposal => this.analyzeProposal(proposal));
    }
}

// Export the AI governance system
module.exports = { GovernanceAI };