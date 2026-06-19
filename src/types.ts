/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ScoreBreakdown {
  overall: number;
  performance: number;
  contentQuality: number;
  mobileOptimization: number;
  userExperience: number;
  technicalSEO: number;
}

export interface MetricItem {
  status: 'success' | 'warning' | 'error';
  value: string;
  message: string;
  suggestion: string;
}

export interface HeadingStructure {
  status: 'success' | 'warning' | 'error';
  h1Count: number;
  h2Count: number;
  h3Count: number;
  message: string;
  structure: string[];
  suggestion: string;
}

export interface KeywordOptimization {
  status: 'success' | 'warning' | 'error';
  found: string[];
  missing: string[];
  densitySummary: string;
  suggestion: string;
}

export interface InternalLinking {
  status: 'success' | 'warning' | 'error';
  linkCount: number;
  brokenLinks: number;
  suggestion: string;
}

export interface ContentReadability {
  status: 'success' | 'warning' | 'error';
  score: number;
  readingGrade: string;
  analysis: string;
  suggestion: string;
}

export interface MobileResponsiveness {
  status: 'success' | 'warning' | 'error';
  viewportSet: boolean;
  issues: string[];
  suggestions: string[];
}

export interface PageSpeed {
  status: 'success' | 'warning' | 'error';
  loadTimeSeconds: number;
  pageSizeMB: number;
  requestCount: number;
  recommendations: string[];
}

export interface Accessibility {
  status: 'success' | 'warning' | 'error';
  score: number;
  issues: string[];
  improvements: string[];
}

export interface AuditDetails {
  metaTitle: MetricItem;
  metaDescription: MetricItem;
  headingStructure: HeadingStructure;
  keywordOptimization: KeywordOptimization;
  internalLinking: InternalLinking;
  contentReadability: ContentReadability;
  ctaImprovements: string[];
  mobileResponsiveness: MobileResponsiveness;
  pageSpeed: PageSpeed;
  accessibility: Accessibility;
}

export interface IssueItem {
  id: string;
  category: string;
  description: string;
  impact: string;
  action: string;
}

export interface QuickWinItem {
  id: string;
  category: string;
  description: string;
  effort: string;
  reward: string;
  action: string;
}

export interface LongTermGrowthItem {
  id: string;
  category: string;
  description: string;
  timeline: string;
  strategy: string;
}

export interface Recommendations {
  criticalIssues: IssueItem[];
  importantImprovements: IssueItem[];
  quickWins: QuickWinItem[];
  longTermGrowth: LongTermGrowthItem[];
}

export interface CompetitorScore {
  url: string;
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
}

export interface CompetitorAnalysis {
  competitors: CompetitorScore[];
  contentGapAnalysis: string[];
  keywordOpportunities: string[];
  roadmap: string[];
}

export interface AuditReport {
  url: string;
  timestamp: string;
  scores: ScoreBreakdown;
  details: AuditDetails;
  recommendations: Recommendations;
  competitorAnalysis?: CompetitorAnalysis;
}

export interface SavedReport {
  id: string;
  url: string;
  timestamp: string;
  overallScore: number;
  report: AuditReport;
}

export type Theme = 'light' | 'dark';

export type AppView = 'home' | 'report' | 'dashboard' | 'pricing';
