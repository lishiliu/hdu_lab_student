import {Component} from '@angular/core';
import {SettingsService} from '@core/services/settings.service';
import {MenuService} from '@core/services/menu.service';

@Component({
  selector: 'app-sider',
  templateUrl: 'sider.component.html',
  styleUrls: ['./sider.component.less']
})
export class SiderComponent {
  theme = true;
  menus: any = [
    {
      'icon': 'home',
      'name': '首页',
      'route': '/index',
    },
    {
      'icon': 'database',
      'name': '我的签到',
      'route': '/studentSignIn'
    },
    {
      'icon': 'calendar',
      'name': '我的课程',
      'route': '/courses'
    }];

  constructor(public settings: SettingsService, private menuService: MenuService) {
    this.theme = this.settings.layout.isDark;
    this.menuService.getMenu();
  }

  switch() {
    this.settings.setLayout('isDark', !this.settings.layout.isDark);
  }
}
