///<reference path="../../../../node_modules/@angular/forms/src/model.d.ts"/>
import {Component, OnInit} from '@angular/core';
import {StudentSignInService} from './studentSignIn.service';
import {Router} from '@angular/router';
import {NzModalService} from 'ng-zorro-antd';
import {SessionStorageService} from '@core/storage/storage.module';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'studentSignIn',
  templateUrl: 'studentSignIn.component.html',
  styleUrls: ['./studentSignIn.component.less'],
  providers: [StudentSignInService]
})
export class StudentSignInComponent implements OnInit {
    constructor(private studentSignInService: StudentSignInService, private confirmServ: NzModalService, private  router: Router,
                private _storage: SessionStorageService, private fb: FormBuilder) {
    }
    validateForm: FormGroup;
    apiUrl = [
        'studentSignIn/getCurrentSignTask', /*0获取签到任务*/
        'studentSignIn/getSignCountToStudent', /*1删除课程*/
        'semester/getNowSemester', // 2
        'user/getUserByUserName',
        'computer/getComputer'
    ];
    options = [
        { value: '2016', label: '2016' },
        { value: '2017', label: '2017' },
        { value: '2018', label: '2018' },
        { value: '2019', label: '2019' },
    ];
    WEEK = ['日', '一', '二', '三', '四', '五', '六', '日'];
    courses = [];
    data = [];
    undoCount;
    doCount;
    // 获取学期
    nowSemester = {
        nowSemester: '',
        maxWeek: 17
    };
    private getSemester() {
        this.studentSignInService.executeGET(this.apiUrl[2])
            .then((result: any) => {
                const res = JSON.parse(result['_body']);
                if (res['result'] === 'success') {
                    this.nowSemester = res['NowSemester'];
                }
            });
    }
    private getAllHours(courses: any) {
        let hours = 0;
        for (let course of courses) {
            hours += course.classNum.length * course.classWeek.length;
        }
        return hours;
    }
    private getHours(course: any) {
        return course.classNum.length * course.classWeek.length;
    }
    private _getData = () => {
        // 获取当前学期信息
        this.getSemester();
        // 获取当前签到任务
        this.studentSignInService.executeHttp(this.apiUrl[0], {studentId: this._storage.get('username')})
            .then((result: any) => {
                const data = JSON.parse(result['_body'])['currentSignTask'];
                for (let i of data) {
                    i.expand = false;
                    // 获取教师信息
                    this.studentSignInService.executeHttp(this.apiUrl[3], {userName: i.userName})
                        .then((res: any) => {
                            let temp = JSON.parse(res['_body'])['User1'];
                            i.userNickname = temp.userNickname;
                            i.email = temp.email;
                            i.phone = temp.phone;
                        });
                }
                this.courses = data;
            });
        this.studentSignInService.executeHttp(this.apiUrl[1], {studentId: this._storage.get('username')})
            .then((result: any) => {
               this.undoCount = JSON.parse(result['_body'])['undoCount'];
                this.doCount = JSON.parse(result['_body'])['doCount'];
            });
    }
    // 签到
    addSignInfo(data: any) {
        this.studentSignInService.executeGET(this.apiUrl[4])
            .then((result: any) => {
                const res = JSON.parse(result['_body']);
                if (res['result'] === 'success') {
                    const str = JSON.stringify(res['NowComputer']);
                    const str2 = JSON.stringify(res['labName']);
                    this._storage.set('curComputer',str);
                    this._storage.set('labName',str2);
                    const str3 = JSON.stringify(data);
                    this._storage.set('signInCourse', str3);
                    this.router.navigate(['/studentSignIn/add']);
                }else{
                    this.info('警告',res['msg']);
                    return;
                }
            });
    }
    info(title, contentTpl) {
        this.confirmServ.info({
            title: title,
            content: contentTpl
        });
    }
    // 获取历史课程
    currentModal;
    showModalForTemplate(titleTpl, contentTpl, footerTpl) {
        const form = this.validateForm;
        let _storage = this._storage;
        const Route = this.router;
        this.currentModal = this.confirmServ.open({
            title       : titleTpl,
            content     : contentTpl,
            footer      : footerTpl,
            onOk() {
                const str = form.controls['fy'].value.value + '-' +
                    form.controls['sy'].value.value + '-' + form.controls['type'].value;
                _storage.set('historyCourses', str);
                Route.navigate(['/studentSignIn/history']);
            },
            onCancel() {
            },
        });
    }
    handleCancel(e) {
        this.currentModal.destroy('onCancel');
        this.currentModal = null;
    }
    isConfirmLoading = false;
    handleOk(e) {
        this.isConfirmLoading = true;
        setTimeout(() => {
            this.currentModal.destroy('onOk');
            this.isConfirmLoading = false;
            this.currentModal = null;
        }, 1000);
    }
    onSearch(event: string): void {
        console.log(event);
    }
    ngOnInit(): void {
        this.validateForm = this.fb.group({
            fy: [null, this.validateForm],
            sy: [null, this.validateForm],
            type: [null, this.validateForm]
        });
        this._getData();
    }

}
