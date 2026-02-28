import { DomainEvents } from "../../../shared/domain/events/DomainEvents";
import { IHandle } from "../../../shared/domain/events/IHandle";
import { UserCreated } from "../domain/events/userCreated";
import { emailService } from "../../../shared/infrastructure/services/EmailService";

export class AfterUserCreated implements IHandle<UserCreated> {
  constructor() {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      DomainEvents.asDomainEventHandler<UserCreated>(this.onUserCreated.bind(this)),
      UserCreated.name
    );
  }

  private async onUserCreated(event: UserCreated): Promise<void> {
    const { user } = event;

    try {
      if (!user.emailVerificationToken) {
        console.warn('[AfterUserCreated]: No verification token found, skipping email.');
        return;
      }

      await emailService.sendVerificationEmail(
        user.email.value,
        user.name.value,
        user.emailVerificationToken,
        user.locale
      );

      console.info(`[AfterUserCreated]: Verification email sent to ${user.email.value}`);
    } catch (err) {
      console.error(`[AfterUserCreated]: Failed to send verification email.`, err);
    }
  }
}
