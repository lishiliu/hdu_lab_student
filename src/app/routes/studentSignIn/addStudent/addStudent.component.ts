///<reference path="../../../../../node_modules/@angular/forms/src/model.d.ts"/>
///<reference path="../../../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import {Component, OnInit} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {AddStudentService} from './addStudent.service';
import {NzModalService} from 'ng-zorro-antd';
import {SessionStorageService} from '@core/storage/storage.service';
import {Router} from '@angular/router';

@Component({
    selector: 'AddStudent',
    templateUrl: 'addStudent.component.html',
    styleUrls: ['./addStudent.component.less'],
    providers: [AddStudentService]
})
export class AddStudentComponent implements OnInit {
    validateForm: FormGroup;
    loadStatus: boolean;
    submitBtn = '提交';
    curl = [
        'studentSignIn/addStudentSign', // 0 签到
        'semester/getNowSemester', // 1获取当前学期
        'computer/getComputerByIp' // 2获取设备信息
    ];
    constructor(private _storage: SessionStorageService, private fb: FormBuilder, private router: Router,
                private addStudentService: AddStudentService, private confirmServ: NzModalService) {
    }
    nowComputer;
    labName;
    nowSemester = {
        nowSemester: '',
        maxWeek: 17
    };
    addStudentSignCourse;
    getFormControl(name) {
        return this.validateForm.controls[name];
    }

    info(title, contentTpl) {
        this.confirmServ.info({
            title: title,
            content: contentTpl
        });
    }
    success = () => {
        const modal = this.confirmServ.success({
            title: '签到成功',
            content: '1秒后回到我的签到管理'
        });
        const Route = this.router;
        setTimeout(function () {
            modal.destroy();
            Route.navigate(['/studentSignIn']);
        }, 1000);
    }
    _submitForm() {
        const data = {
            studentId: this._storage.get('username'),
            classId: this.addStudentSignCourse.classId,
            computerNo: this.nowComputer.computerNum,
            labId: this.nowComputer.labId
        };
        this.addStudentService.executeHttp(this.curl[0], data)
            .then((result: any) => {
                const res = JSON.parse(result['_body']);
                if (res['result'] === 'success') {
                    this.success();
                } else {
                    this.info('警告',res['msg']);
                    return;
                }
            });
    }
    private getData() {
        // 获取学期
        this.addStudentService.executeGET(this.curl[1])
            .then((result: any) => {
                const res = JSON.parse(result['_body']);
                if (res['result'] === 'success') {
                    this.nowSemester = res['NowSemester'];
                }
            });
    }
    private _getData = () => {
        // 获取签到课程
        this.addStudentSignCourse = JSON.parse(this._storage.get('signInCourse'));
        this.nowComputer = JSON.parse(this._storage.get('curComputer'));
        this.labName = JSON.parse(this._storage.get('labName'));
    }
    ngOnInit() {
        this.getData();
        this._getData();
        this.validateForm = this.fb.group({
            signClassId: [null, [Validators.required]],
            signClassName: [null, [Validators.required]],
            signComputerNo: [null, [Validators.required]],
            signLabName: [null, [Validators.required]],
        });
    }
}
