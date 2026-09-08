from __future__ import annotations

import subprocess
import sys
from pathlib import Path


LAB_DIRECTORY = Path(__file__).resolve().parents[1]
PRACTICE_DIRECTORY = LAB_DIRECTORY / "practice"


def run_practice_file(filename: str) -> str:
    """Run one practice file exactly as a learner would run it."""

    completed = subprocess.run(
        [sys.executable, str(PRACTICE_DIRECTORY / filename)],
        cwd=LAB_DIRECTORY,
        check=True,
        capture_output=True,
        text=True,
    )
    return completed.stdout


def test_prompt_files_print_only_prompt_engineering_exercises() -> None:
    starter_output = run_practice_file("prompt_starter.py")
    answer_output = run_practice_file("prompt_answers.py")

    assert "Prompt Engineering Exercise 1" in starter_output
    assert "Prompt Engineering Exercise 3" in answer_output
    assert "Prompt Evaluation Exercise" not in starter_output
    assert "Prompt Evaluation Exercise" not in answer_output


def test_evaluation_files_print_only_prompt_evaluation_exercises() -> None:
    starter_output = run_practice_file("evaluation_starter.py")
    answer_output = run_practice_file("evaluation_answers.py")

    assert "Prompt Evaluation Exercise 1" in starter_output
    assert "Prompt Evaluation Exercise 1" in answer_output
    assert "Prompt Evaluation Exercise 2" not in starter_output
    assert "Prompt Evaluation Exercise 2" not in answer_output
    assert "Prompt Engineering Exercise" not in starter_output
    assert "Prompt Engineering Exercise" not in answer_output


def test_shared_prompt_and_evaluation_files_are_removed() -> None:
    assert not (PRACTICE_DIRECTORY / "starter.py").exists()
    assert not (PRACTICE_DIRECTORY / "answers.py").exists()
