import { message } from 'antd';
import * as binconv from 'binconv';
import _ from 'lodash';

export function fileListToString(fileList) {
  const fileListString = _.chain(fileList)
    .map(function (file) {
      return file.filename;
    })
    .join('&')
    .value();
  return fileListString;
}

export function fileStringToList(fileString) {
  return _.split(fileString, '&');
}

export function fileStringToAntdFileList(fileString) {
  if (!fileString) return [];
  if (_.split(fileString, '&').length === 0) return [];
  const fileList = _.chain(fileString)
    .split('&')
    .map((value, index) => {
      const length = value ? _.split(value, '/').length : 0;
      const name = value ? _.split(value, '/')[length - 1] : '';
      return {
        uid: index.toString(),
        name,
        status: 'done',
        url: value,
      };
    })
    .value();
  return fileList;
}

export function getsuffix(filename) {
  const filenameArray = filename.split('.');
  const suffix = _.toLower(filenameArray[filenameArray.length - 1]);
  return suffix;
}

export function isPicture(filename) {
  const suffix = getsuffix(filename);
  return (
    suffix === 'png' ||
    suffix === 'jpg' ||
    suffix === 'gif' ||
    suffix === 'svg' ||
    suffix === 'jpeg'
  );
}

export function isZip(filename) {
  const suffix = getsuffix(filename);
  return (
    suffix === 'zip' ||
    suffix === 'rar' ||
    suffix === '7z' ||
    suffix === 'tar' ||
    suffix === 'gz' ||
    suffix === 'bz2'
  );
}

export function isPDF(filename) {
  const suffix = getsuffix(filename);
  return suffix === 'pdf';
}

export function upload(file, handleUpload) {
  const suffix = getsuffix(file.name);
  const filename = suffix + '/' + Date.now() + file.name;
  retrievePutNewURL(file, filename, (file, url) => {
    uploadFile(file, url, handleUpload, filename, file.uid);
  });
}

// `retrieveNewURL` accepts the name of the current file and invokes the `/presignedUrl` endpoint to
// generate a pre-signed URL for use in uploading that file:
export function retrievePutNewURL(file, filename, cb) {
  fetch(`http://10.10.0.27:3300/presignedPutUrl?name=${filename}`)
    .then((response) => {
      response.text().then((url) => {
        cb(file, url);
      });
    })
    .catch((e) => {
      console.error(e);
    });
}

// ``uploadFile` accepts the current filename and the pre-signed URL. It then uses `Fetch API`
// to upload this file to S3 at `play.min.io:9000` using the URL:
export function uploadFile(file, url, handleUpload, filename, uid) {
  fetch(url, {
    method: 'PUT',
    body: file,
  })
    .then((res) => {
      message.success('上传成功');
      handleUpload(true, filename, uid);
      // If multiple files are uploaded, append upload status on the next line.
      // document.querySelector('#status').innerHTML += `<br>Uploaded ${file.name}.`;
    })
    .catch((e) => {
      message.error('上传失败');
      handleUpload(false, filename, uid);
      console.error(e);
    });
}

export function retrieveGetNewURL(name, cb) {
  fetch(`http://10.10.0.27:3300/presignedGetUrl?name=${name}`)
    .then((response) => {
      response.text().then((body) => {
        cb(body);
      });
    })
    .catch((e) => {
      console.error(e);
    });
}

export function getFile(url, filename, cb) {
  const fileType = getsuffix(filename);
  fetch(url, {
    method: 'GET',
  })
    .then(async (res) => {
      const blob = await binconv.readableStreamToBlob(res.body);
      const file = new File([blob], filename, { type: fileType });
      cb(file);
    })
    .catch((e) => {
      console.log('e:', e);
    });
}

export function preview(filename, handlePreview) {
  retrieveGetNewURL(filename, (body) => {
    getFile(body, filename, handlePreview);
  });
}
