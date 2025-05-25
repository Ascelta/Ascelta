import Config from 'react-native-config';

export class AppConfig {
  static APP_ID: string = Config.APP_ID;
  static APP_ENV: string = Config.APP_ENV;
  static APP_DISPLAY_NAME: string = Config.APP_DISPLAY_NAME;
  static WEB_URL: string = Config.WEB_URL;
  /// Screen Name の最小文字数
  static SCREEN_NAME_MIN_LENGTH = 4;
  /// Screen Name の最大文字数
  static SCREEN_NAME_MAX_LENGTH = 16;
  /// 表示名の最大文字数
  static DISPLAY_NAME_MAX_LENGTH = 20;
  /// 自己紹介の最大行数
  static SELF_INTRODUCTION_MAX_LINES = 5;
  /// 自己紹介の最大文字数
  static SELF_INTRODUCTION_MAX_LENGTH = 160;
  /// 投稿を取得する際の数
  static FETCH_POST_COUNT = 10;
  /// 投稿のテキストの最大文字数
  static POST_TEXT_MAX_LENGTH = 200;
  /// 選択可能なメディアの最大数
  static MAX_MEDIA_COUNT = 4;
  /// 動画の最大秒数
  static MAX_VIDEO_SECONDS = 140;
}
