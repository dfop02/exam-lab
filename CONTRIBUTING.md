# Contributing
You can contribue with this project by many ways.

## Bugs / Grammar / Questions Issues

If you find a bug, wrongs answers, grammar, etc. [open a issue](https://github.com/dfop02/exam-lab/issues) and I'll try fix the problem.

## New features

If you want try add new feature, like support to other languages, [open a PR](https://github.com/dfop02/exam-lab/compare) and let's see what cool new feature you want add to the project.

## How Add Exams

If you want add new exams to the project, fork this project and create a branch with `exams/add_exam_name` with your `assets/exams/exam_name.json` and open a PR to my origin/main branch. The exam must follow the same structure, take a look on [Google Cloud Digital Leader](https://github.com/dfop02/exam-lab/blob/main/assets/exams/google_cloud_digital_leader.json) exam to take an fully example, but I shall explain in details above.

The structure of `exam.json` is very simples, let's take a look on the next example:

```json
{
  "exam":[
    {
      "question":"An organization needs to migrate specialized workloads to the cloud while maintaining their existing complex licensing and architecture. What Google Cloud solution should the organization use?",
      "multichoice":false,
      "alternatives":{
        "A":{
          "answer":"Compute Engine",
          "correct":false,
          "why":""
        },
        "B":{
          "answer":"Bare Metal Solution",
          "correct":true,
          "why":""
        },
        "C":{
          "answer":"Cloud Run",
          "correct":false,
          "why":""
        },
        "D":{
          "answer":"Cloud Function",
          "correct":false,
          "why":""
        }
      }
    },
    ...
  ]
}
```

File must have an `exam` with a list of questions of you exam, you can add multiple questions without limits to your exam.
The questions with `multichoice` naturally has multiple "correct" while normal questions has only one correct answer, so be careful when add.

**OBS:** For now, questions with _images_ and _code_ has no support yet, so ignore then.
