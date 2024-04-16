import { Model } from 'mongoose';
import { Coi, Edo, Rod, Ros } from './schemas/bonds.polishTreasury';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

export type bondGlobalType = 'fixed' | 'reference' | 'cpi';
// export type bondType =

interface PolishTreasuryFactory {
  getModel(): Model<Edo | Coi | Ros | Rod>;
  getLengthInMonths(): number;
  getGlobalType(): bondGlobalType;
}

@Injectable()
export class EdoFactory implements PolishTreasuryFactory {
  constructor(@InjectModel(Edo.name) private edoModel: Model<Edo>) {}

  getModel(): Model<Edo> {
    return this.edoModel;
  }

  getLengthInMonths(): number {
    return 10 * 12;
  }

  getGlobalType(): bondGlobalType {
    return 'cpi';
  }
}

@Injectable()
export class CoiFactory implements PolishTreasuryFactory {
  constructor(@InjectModel(Coi.name) private coiModel: Model<Coi>) {}

  getModel(): Model<Coi> {
    return this.coiModel;
  }

  getLengthInMonths(): number {
    return 4 * 12;
  }
  getGlobalType(): bondGlobalType {
    return 'cpi';
  }
}

@Injectable()
export class RosFactory implements PolishTreasuryFactory {
  constructor(@InjectModel(Ros.name) private rosModel: Model<Ros>) {}

  getModel(): Model<Ros> {
    return this.rosModel;
  }

  getLengthInMonths(): number {
    return 6 * 12;
  }
  getGlobalType(): bondGlobalType {
    return 'cpi';
  }
}

@Injectable()
export class RodFactory implements PolishTreasuryFactory {
  constructor(@InjectModel(Rod.name) private rodModel: Model<Rod>) {}

  getModel(): Model<Rod> {
    return this.rodModel;
  }

  getLengthInMonths(): number {
    return 12 * 12;
  }
  getGlobalType(): bondGlobalType {
    return 'cpi';
  }
}

@Injectable()
export class BondFactory {
  constructor(
    private readonly edoFactory: EdoFactory,
    private readonly coiFactory: CoiFactory,
    private readonly rosFactory: RosFactory,
    private readonly rodFactory: RodFactory,
  ) {}

  getBondFactory(bondType: string): PolishTreasuryFactory {
    switch (bondType) {
      case 'EDO':
        return this.edoFactory;
      case 'COI':
        return this.coiFactory;
      case 'ROS':
        return this.rosFactory;
      case 'ROD':
        return this.rodFactory;

      default:
        throw new Error(`Invalid type: ${bondType}`);
    }
  }
}
