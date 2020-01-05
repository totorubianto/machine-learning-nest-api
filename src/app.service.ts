import { Injectable } from '@nestjs/common';
import * as brain from 'brain.js';
import * as path from 'path';
import * as fs from 'fs';
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  async machineLearning() {
    const buffer: any = await fs.readFileSync(
      path.join(__dirname, '../src/json/category.json'),
    );
    const data = await JSON.parse(buffer.toString());
    const config = {
      iterations: 1500,
      log: true,
      logPeriod: 50,
      layers: [10],
    };
    let trained = [] as brain.IRNNTrainingData[];
    data.map((item: any) => {
      trained.push({
        input: item.text,
        output: item.category,
      });
    });
    console.log(trained);

    const network = new brain.recurrent.LSTM();
    let networkData = null;
    if (
      fs.existsSync(path.join(__dirname, '../src/json/machine-learning.json'))
    ) {
      console.log('true');
      const networkPath: any = await fs.readFileSync(
        path.join(__dirname, '../src/json/machine-learning.json'),
      );
      networkData = JSON.parse(networkPath);
      network.fromJSON(networkData);
    } else {
      console.log('false');
      network.train(trained, config);
      fs.writeFileSync(
        path.join(__dirname, '../src/json/machine-learning.json'),
        JSON.stringify(network.toJSON(), null, 2),
      );
    }

    const output = network.run('programing');
    return output;
  }
}
