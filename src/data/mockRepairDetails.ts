
export type RepairStageStatus =
  | "completed"
  | "running"
  | "pending"
  | "failed";

export type RepairStage = {
  id: string;
  title: string;
  description: string;
  status: RepairStageStatus;
  time: string;
};

export type ChangedFile = {
  path: string;
  change: "modified" | "added" | "deleted";
  additions: number;
  deletions: number;
  diff: string[];
};

export type TestResult = {
  id: string;
  name: string;
  status: "passed" | "failed" | "skipped";
  duration: string;
  output: string;
};

export const mockRepairDetails = {
  id: "PR-1042",
  title: "Payment request fails for valid card",
  repository: "payment-service",
  branch: "main",
  language: "TypeScript",
  createdAt: "Oct 18, 2026 · 10:15 AM",
  description:
    "Payment requests sometimes fail even when the card details are valid. The error appears to occur during payment validation.",

  reproductionSteps: [
    "Start the payment service in the development environment.",
    "Submit a payment request with valid card details.",
    "Observe the response returned by the validation endpoint.",
  ],

  stages: [
    {
      id: "queued",
      title: "Queued",
      description: "Repair request created",
      status: "completed",
      time: "10:15 AM",
    },
    {
      id: "analyzing",
      title: "Analyzing",
      description: "Investigating the reported issue",
      status: "completed",
      time: "10:16 AM",
    },
    {
      id: "patch",
      title: "Generating patch",
      description: "Preparing a proposed code change",
      status: "completed",
      time: "10:17 AM",
    },
    {
      id: "testing",
      title: "Testing",
      description: "Review the example test results below",
      status: "completed",
      time: "10:18 AM",
    },
    {
      id: "review",
      title: "Awaiting review",
      description: "Review the proposed changes",
      status: "running",
      time: "Now",
    },
  ] satisfies RepairStage[],

  files: [
    {
      path: "src/payment/validatePayment.ts",
      change: "modified",
      additions: 4,
      deletions: 2,
      diff: [
        " export function validatePayment(card: CardDetails) {",
        "-  if (!card.number || !card.expiry) {",
        "+  if (!card.number?.trim() || !card.expiry?.trim()) {",
        "     return { valid: false, reason: 'Missing card details' };",
        "   }",
        "-  return validateExpiry(card.expiry);",
        "+  return validateCardNumber(card.number) && validateExpiry(card.expiry);",
        " }",
      ],
    },
    {
      path: "tests/payment/validatePayment.test.ts",
      change: "added",
      additions: 6,
      deletions: 0,
      diff: [
        "+ describe('validatePayment', () => {",
        "+   it('rejects missing card details', () => {",
        "+     expect(validatePayment({ number: '', expiry: '' }).valid).toBe(false);",
        "+   });",
        "+ });",
      ],
    },
  ] satisfies ChangedFile[],

  tests: [
    {
      id: "test-1",
      name: "Rejects missing card details",
      status: "passed",
      duration: "12 ms",
      output: "Example result only. No real test was executed.",
    },
    {
      id: "test-2",
      name: "Validates card expiry",
      status: "passed",
      duration: "8 ms",
      output: "Example result only. No real test was executed.",
    },
    {
      id: "test-3",
      name: "Payment validation integration",
      status: "skipped",
      duration: "—",
      output: "Skipped. No real test runner was executed.",
    },
  ] satisfies TestResult[],
};
