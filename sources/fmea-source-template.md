# Failure Mode and Effects Analysis (FMEA)

## Overview
* **System/Process:** [Name of system, product, or process]
* **Date:** [YYYY-MM-DD]
* **Prepared By:** [Team or Author Name]
* **Version:** [1.0]

---

## Scoring Scale (1-10)
* **Severity (S):** 1 (No effect) to 10 (Catastrophic impact)
* **Occurrence (O):** 1 (Very unlikely) to 10 (Almost certain/frequent)
* **Detection (D):** 1 (Certain to detect) to 10 (Impossible to detect)
* **Risk Priority Number (RPN) = Severity × Occurrence × Detection**

---

## FMEA Register

| ID | Component / Process Step | Potential Failure Mode | Potential Effect of Failure | S | Potential Cause | O | Current Controls | D | RPN | Recommended Action | Owner | Status |
|----|--------------------------|------------------------|-----------------------------|---|-----------------|---|------------------|---|-----|--------------------|-------|--------|
| 01 | [e.g., Database] | [Connection timeout] | [Service outage] | 8 | [High load / bad pool] | 3 | [Basic monitoring] | 4 | 96 | [Optimize pool limits] | [DevOps] | Open |
| 02 | | | | | | | | | | | | |

---

## Action Tracking & Review
* **High Priority Threshold:** RPN > 100 requires immediate mitigation.
* **Review Date:** [YYYY-MM-DD]
