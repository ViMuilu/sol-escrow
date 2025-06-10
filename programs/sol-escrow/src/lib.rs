use anchor_lang::prelude::*;

declare_id!("3vXTDchzLSC683QqkdBT8VYWk2baJXMEtgTYoXaqFjGy");

#[program]
pub mod sol_escrow {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
