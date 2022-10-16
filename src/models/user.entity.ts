import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    userId: number;

    @Column({ type: 'char', unique: true, comment: '邮箱' })
    email: string

    @Column({ type: 'varchar', unique: true, comment: '香港身份证号码', length: 10 })
    hkId: string

}
