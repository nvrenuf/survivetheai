import type { PostEntry } from '../content/config';

export type ClaimsVerificationEntry = {
  supported: string[];
  uncertain: string[];
  note?: string;
};

export const CLAIMS_VERIFICATION_BY_SLUG: Record<string, ClaimsVerificationEntry> = {
  'ai-is-leaving-the-cloud': {
    supported: [
      'Cheaper local and open-weight models reduce the friction that used to slow automation.',
      'Private, on-device AI makes quiet labor substitution easier to deploy and harder to notice early.',
      'Job erosion can happen through workflow compression before formal layoffs become visible.',
    ],
    uncertain: [
      'The exact pace of displacement by sector and company size remains uneven.',
      'Long-run wage effects and replacement timing will vary across roles and regions.',
    ],
  },
  'ai-agents-arent-tools': {
    supported: [
      'Agentic systems can automate workflows, not just isolated tasks.',
      'White-collar roles built around throughput, summaries, and coordination are exposed to compression.',
      'Adoption is accelerating because agents are being embedded into existing software stacks.',
    ],
    uncertain: [
      'The exact long-run scale of headcount loss is still uncertain.',
      'Middle-management and oversight roles may shrink, change shape, or harden around governance depending on the org.',
    ],
  },
  'ai-chatfishing-ai-wingmen-dating-apps': {
    supported: [
      'AI-assisted romantic messaging and profile optimization are already part of modern dating behavior.',
      'Platforms and third-party tools are actively experimenting with AI help for prompts, photos, and conversation.',
      'Short-form AI detection remains unreliable enough that verification still has to be behavioral, not automated.',
    ],
    uncertain: [
      'The share of dating conversations that are heavily AI-mediated is still hard to measure cleanly.',
      'Long-term relationship outcomes from AI-assisted courtship remain under-studied.',
    ],
  },
  'ai-cheating-collapse-of-academic-trust': {
    supported: [
      'Generative AI makes it easier for students to outsource visible schoolwork.',
      'Detection tools are too inconsistent to function as a sole enforcement mechanism.',
      'Assessment redesign is emerging as the strongest practical response when trust in submitted work weakens.',
    ],
    uncertain: [
      'The exact prevalence of AI-enabled cheating varies by classroom, age, and policy environment.',
      'How quickly trust collapse will reshape grading, admissions, and credential value is still unsettled.',
    ],
  },
  'ai-divide-classrooms': {
    supported: [
      'The meaningful divide is no longer access alone but how students are guided to use AI.',
      'Teacher supervision, policy clarity, and metacognitive habits strongly shape whether AI deepens or weakens learning.',
      'Students can use the same tool in ways that either improve thinking or bypass it.',
    ],
    uncertain: [
      'The long-run equity effects of the AI divide are still developing.',
      'Schools do not yet have one proven governance model that works across contexts.',
    ],
  },
  'ai-study-platforms-2025': {
    supported: [
      'Different AI study tools reinforce different skills rather than serving as one interchangeable category.',
      'Tool choice should be driven by the skill a student is trying to build, not novelty or speed alone.',
      'Overuse can create dependency when the tool starts replacing thinking instead of supporting it.',
    ],
    uncertain: [
      'There is limited long-term evidence on which platforms improve durable learning best.',
      'Rapid product changes can alter strengths and weaknesses faster than static reviews stay current.',
    ],
  },
  aifears: {
    supported: [
      'Public AI anxiety consistently clusters around jobs, synthetic media, loss of control, warfare, and scaled bias.',
      'These fears are tied to real mechanisms rather than pure science-fiction framing.',
      'Governance, oversight, and informed public use remain core response levers across risk categories.',
    ],
    uncertain: [
      'The timing and severity of worst-case outcomes differ widely by fear area.',
      'No single forecast can confidently rank which AI risk will break first.',
    ],
  },
  aiproofyourkid: {
    supported: [
      'Children need boundaries, resilience, and critical thinking habits around AI rather than unrestricted tool exposure.',
      'Parents still matter as interpreters, limit-setters, and skill builders in the household.',
      'Practical habits beat abstract panic when families are trying to adapt early.',
    ],
    uncertain: [
      'There is no single parenting framework that fits every age, child, or school context.',
      'The strongest household interventions will keep changing as tools and norms evolve.',
    ],
  },
  'alone-together': {
    supported: [
      'AI companions can reduce loneliness in the short term while still weakening real-world connection over time.',
      'Heavy reliance can correlate with less human socializing and greater emotional dependence.',
      'Synthetic intimacy can change expectations people bring into human relationships.',
    ],
    uncertain: [
      'Long-term psychological effects are still emerging.',
      'Researchers do not yet know which users are most vulnerable versus most helped.',
    ],
  },
  byebyedevs: {
    supported: [
      'AI is already compressing developer work that is routine, boilerplate-heavy, or syntax-bound.',
      'The durable value of human developers shifts upward toward architecture, judgment, and accountability.',
      'Coding remains visible, but the broader labor shift is about abstraction and leverage, not just code generation.',
    ],
    uncertain: [
      'The exact rate of displacement will vary by company, stack, and seniority level.',
      'Not every developer path will shrink the same way or on the same timeline.',
    ],
  },
  'collapse-of-thinking-skills-ai-education': {
    supported: [
      'AI can outsource planning, drafting, and reasoning steps while leaving polished output behind.',
      'Foundational skill development is threatened when students bypass cognitive struggle repeatedly.',
      'Parents and educators can mistake fluent output for real understanding.',
    ],
    uncertain: [
      'The long-run cognitive effects across large populations are still being measured.',
      'Schools are still testing which interventions restore genuine thinking without banning every tool.',
    ],
  },
  credentialism: {
    supported: [
      'Credentials alone are becoming weaker signals in environments where AI can simulate polished competence.',
      'Proof of work, narrative clarity, and demonstrated judgment matter more when baseline output gets cheaper.',
      'Traditional signaling systems are under pressure from both automation and abundance.',
    ],
    uncertain: [
      'Employers will not reprice degrees, certificates, and portfolios at the same speed.',
      'The new balance between credentials and demonstrated work is still shifting by field.',
    ],
  },
  'normal-photo-child-ai-risk': {
    supported: [
      'AI-generated sexualized fake images of children are a real and growing abuse problem.',
      'Ordinary public photos can be enough source material for synthetic-image harm.',
      'The harm is real even when the image itself is fabricated.',
    ],
    uncertain: [
      'The exact prevalence and long-run aggregate impact across large child populations are still unclear.',
      'Schools, platforms, and legal systems are still uneven in how quickly they are adapting.',
    ],
  },
  'entry-level-is-dead': {
    supported: [
      'Entry-level work built around repetition, support, and draft-generation is highly exposed to AI compression.',
      'Career-ladder damage matters even before unemployment shows up in headline numbers.',
      'People early in their careers need to move toward visible ownership and harder-to-automate outcomes.',
    ],
    uncertain: [
      'The exact magnitude and timing of entry-level contraction remain uncertain.',
      'Economic and policy responses could soften, delay, or redistribute the damage.',
    ],
  },
  rapidchange: {
    supported: [
      'Rapid AI change rewards adaptability, learning speed, and flexibility more than rigid planning alone.',
      'People who can update their habits and models quickly are better positioned for repeated shocks.',
      'Survival depends on response capacity, not just raw intelligence or optimism.',
    ],
    uncertain: [
      'Which industries will stabilize first is still unclear.',
      'The best adaptation strategy remains highly context-dependent by role and household situation.',
    ],
  },
  'replacing-human-intimacy': {
    supported: [
      'Synthetic intimacy tools can simulate care and attention in ways that exploit loneliness.',
      'Short-term comfort can coexist with deeper distortions in attachment and expectation.',
      'The issue is not only niche chatbots but a broader shift in how people outsource emotional connection.',
    ],
    uncertain: [
      'The long-term cultural scale of synthetic intimacy is still difficult to measure.',
      'Researchers do not yet know how stable these relationship-pattern changes will become.',
    ],
  },
  riseofgigeconomy: {
    supported: [
      'AI and platform coordination can expand task-based and freelance labor arrangements.',
      'Flexibility often arrives with weaker stability, bargaining power, and predictability.',
      'Workers need to treat volatility itself as part of the risk model.',
    ],
    uncertain: [
      'It remains unclear how far gig-style work will spread into each sector.',
      'Some labor markets may absorb AI through hybrid models rather than pure gig expansion.',
    ],
  },
  'the-nationalization-of-ai': {
    supported: [
      'States already have legal, procurement, and coercive tools that can be applied to strategic technologies.',
      'Historical precedent exists for federal control or directed compliance in strategic infrastructure moments.',
      'If frontier AI becomes decisive to national power, private red lines are unlikely to hold on their own.',
    ],
    uncertain: [
      'No one can identify the precise trigger or date for coercive state intervention.',
      'The timing threshold for action will depend on geopolitical and domestic pressure, not one simple metric.',
    ],
  },
};

export function hasClaimsVerificationForSlug(slug: string): boolean {
  return Boolean(CLAIMS_VERIFICATION_BY_SLUG[slug]);
}

export function getClaimsVerificationForPost(post: PostEntry): ClaimsVerificationEntry | null {
  if (post.data.draft || post.data.internal) {
    return null;
  }

  const entry = CLAIMS_VERIFICATION_BY_SLUG[post.slug];
  if (!entry) {
    throw new Error(`[claims-verification] Missing claimsVerification entry for public post: ${post.slug}`);
  }

  return entry;
}
