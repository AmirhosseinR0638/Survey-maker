import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
  FormsModule,
} from '@angular/forms';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  MCQArray = [
    //save the multiple-choice questions
    {
      questionText: 'زبان ما قادر به چشیدن چند نوع مزه است؟',
      options: ['4 نوع', '5 نوع', '6 نوع'],
      correctOption: '4 نوع',
    },
    {
      questionText: 'اولین کشوری که چای را شناخت کدام کشور است؟',
      options: ['چین', 'آمریکا', 'ایران', 'آلمان'],
      correctOption: 'چین',
    },
    {
      questionText: 'بزرگترین صنعت در جهان کدام است؟',
      options: ['خودروسازی', 'لباس و پوشاک', 'کشاورزی', 'برق', 'غذایی', 'چوب'],
      correctOption: 'خودروسازی',
    },
    {
      questionText: 'شهر آمستردام در کدام کشور قرار دارد؟',
      options: ['برزیل', 'کانادا', 'هلند', 'آلمان'],
      correctOption: 'هلند',
    },
    {
      questionText: 'کدام مهره شطرنج نمیتواند در یک خط صاف حرکت کند؟',
      options: ['وزیر', 'اسب'],
      correctOption: 'اسب',
    },
  ];
  WQArray = [
    //save the written questions
    { questionText: 'پر جمعیت ترین کشور جهان کدام است؟', correctAnswer: 'چین' },
    { questionText: 'کشور مصر در کدام قاره است؟', correctAnswer: 'آفریقا' },
    { questionText: 'برلین پایتخت کدام کشور است؟', correctAnswer: 'آلمان' },
    { questionText: 'واحد اندازه گیری الماس چیست؟', correctAnswer: 'قیراط' },
    { questionText: 'مقبره شهریار در کدام شهر است؟', correctAnswer: 'تبریز' },
  ];
  isMCQAnswered: boolean[] = []; //if multiple-choice question's answer is answered, add true in that index
  isWQAnswered: boolean[] = []; //if written question's answer is answered, add true in that index
  isMCQCorrect: boolean[] = []; //if multiple-choice question's answer is correct, add true in that index
  isWQCorrect: boolean[] = []; //if written question's answer is correct, add true in that index
  currentSide: string; //current part of template
  hideBTN: boolean = false;
  isFinalSubmit: boolean = false;
  currentQuestionType: string = 'MCQ';
  multipleChoiceQuestions: FormGroup = new FormGroup({
    questionText: new FormControl('', Validators.required),
    options: new FormArray([]),
    correctOption: new FormControl(''),
  });
  writtenQuestions: FormGroup = new FormGroup({
    questionText: new FormControl('', Validators.required),
    correctAnswer: new FormControl('', Validators.required),
  });
  checkMCQAnswered: FormGroup = new FormGroup({
    //for get answer that user chosen
    selectedOption: new FormControl(''),
  });
  checkWQAnswered: FormGroup = new FormGroup({
    //for get answer that user written
    answer: new FormControl(''),
  });
  changeSide(side: string) {
    //change the question type that you want to create
    this.currentQuestionType = side;
  }
  changeContent(value: string) {
    //change the part of web app that you clicked(between create question and made questions)
    this.currentSide = value;
    this.currentQuestionType = 'MCQ';
  }
  MCQSubmitted() {
    //push question to questions array
    this.MCQArray.push({
      questionText: this.multipleChoiceQuestions.value.questionText,
      options: this.multipleChoiceQuestions.value.options,
      correctOption: this.multipleChoiceQuestions.value.correctOption,
    });
    this.multipleChoiceQuestions.reset();
  }
  WQSubmitted() {
    //push question to questions array
    this.WQArray.push({
      questionText: this.writtenQuestions.value.questionText,
      correctAnswer: this.writtenQuestions.value.correctAnswer,
    });
    this.writtenQuestions.reset();
  }
  addOption(option: HTMLInputElement) {
    //add option for MCQ that you want to create
    this.multipleChoiceQuestions.get('options').value.push(option.value);
    option.value = '';
  }
  deleteOption(optionIndex: number) {
    //delete option for MCQ that you want to create
    this.multipleChoiceQuestions.get('options').value.splice(optionIndex, 1);
  }
  MCQInputValue: string;
  sendMCQInputValue(input: any) {
    //get MCQ input value that you submitted
    this.MCQInputValue = input.target.value;
  }
  WQInputValue: string;
  sendWQInputValue(input: any) {
    //get WQ input value that you submitted
    this.WQInputValue = input.target.value;
  }
  checkMCQAnswer(index: number) {
    //check, if question answered put that index true in isMCQAnswered array and if it's true answer put that index true in isMCQCorrect
    this.isMCQAnswered[index] = true;
    if (this.MCQInputValue == this.MCQArray[index].correctOption) {
      this.isMCQCorrect[index] = true;
    } else {
      this.isMCQCorrect[index] = false;
    }
  }
  checkWQAnswer(index: number) {
    //check, if question answered put that index true in isWQAnswered array and if it's true answer put that index true in isWQCorrect
    if (this.WQInputValue.length != 0) {
      this.isWQAnswered[index] = true;
    } else {
      this.isWQAnswered[index] = false;
    }
    if (this.WQArray[index].correctAnswer == this.WQInputValue) {
      this.isWQCorrect[index] = true;
    } else {
      this.isWQCorrect[index] = false;
    }
  }
  trueMCQIndex: number[]; //index of MCQ that answered true
  trueWQIndex: number[]; //index of WQ that answered true
  trueMCQFrequency: number; //number of MCQ that answered true
  trueWQFrequency: number; //number of WQ that answered true
  grade: number;
  gradeSituation: string = ''; //is good, normal or bad
  showResultBox: boolean = false;
  finalSubmit() {
    //save answers and check them after that show the results and grade
    this.isFinalSubmit = true;
    this.showResultBox = true;
    this.trueMCQIndex = [];
    this.trueWQIndex = [];
    this.trueMCQFrequency = 0;
    this.trueWQFrequency = 0;
    for (let i = 0; i < this.isMCQCorrect.length; i++) {
      if (this.isMCQCorrect[i]) {
        this.trueMCQIndex.push(i + 1);
      }
    }
    for (let i = 0; i < this.isWQCorrect.length; i++) {
      if (this.isWQCorrect[i]) {
        this.trueWQIndex.push(i + 1);
      }
    }
    this.trueMCQFrequency = this.trueMCQIndex.length;
    this.trueWQFrequency = this.trueWQIndex.length;
    this.grade =
      (this.trueMCQFrequency + this.trueWQFrequency) /
      (this.MCQArray.length + this.WQArray.length);
    if (this.grade == 100) {
      this.gradeSituation = 'بسیارعالی';
    } else if (this.grade >= 80 && this.grade < 100) {
      this.gradeSituation = 'بسیارخوب';
    } else if (this.grade >= 50 && this.grade < 80) {
      this.gradeSituation = 'خوب';
    } else if (this.grade >= 30 && this.grade < 50) {
      this.gradeSituation = 'متوسط';
    } else {
      this.gradeSituation = 'غیرقابل قبول';
    }
    setTimeout(() => {
      window.scrollTo(0, 8000);
    }, 300);
  }
  closeResultBox() {
    //hide the result and grade section
    this.showResultBox = false;
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 300);
  }
}
