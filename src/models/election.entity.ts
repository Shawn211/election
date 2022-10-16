import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Election {

    @PrimaryGeneratedColumn()
    electionId: number;

    @Column({
        type: 'enum',
        enum: [0, 1, 2],
        default: 0,
        comment: '选举状态: 0-未开始 1-进行中 2-已结束'
    })
    status: number

}
