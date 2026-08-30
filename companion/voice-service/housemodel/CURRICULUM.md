# What the first jarvis-house run taught us

Deployed 2026-08-29 late evening, rolled back the same night. Two live
failures within minutes, both curriculum problems, not pipeline problems:

1. **Homework as memories.** Asked about camera activity - something it has
   no tool for - it reported "a timer for the pasta" that never existed. The
   synthetic status exchanges read like state, and the model memorized them
   as facts. Fix for the next run: status answers in training data must be
   grounded in a tool RESULT present in the conversation, never free-standing;
   and add a big slice of "you have no tool for that" examples ("any camera
   activity?", "what's the water bill?", "did anyone call?") whose correct
   answer is a plain, brief "I can't check that."

2. **Narrating tools.** It announces the tool before calling it. Every
   tool-call turn in the training set must carry an EMPTY content field -
   the call is the whole turn; the words come after the result.

Also worth a slice: dismissals/fragments (already present), and examples
where the right move is asking one clarifying question ending in "?".

The pipeline itself is proven (train_house.py end to end, native tool
calls, house naming). Rerun only after dataset.py implements the above;
A/B against stock with at least a dozen off-script and no-tool questions
before switching the pipeline again - the 3-question audition that cleared
the first run was too shallow to catch either failure.
